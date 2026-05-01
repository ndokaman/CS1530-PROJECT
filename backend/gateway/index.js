require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const workoutsRouter = require('../workouts/routes');
const mealsRouter = require('../meals/routes');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

app.use(express.json());

// Request logger so each call is visible in the backend terminal during demos.
app.use((req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - started;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// Input validation middleware
// Checks that all required fields are present in the request body
function validateBody(requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => !req.body[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missing,
      });
    }
    next();
  };
}

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.get('/auth', (req, res) => {
  res.status(200).json({
    message: 'Auth service skeleton ready',
    loginPath: '/auth/pitt/login',
    callbackPath: '/auth/pitt/callback',
  });
});

app.get('/auth/pitt/login', (req, res) => {
  const redirectUri = req.query.redirect_uri || '/auth/pitt/callback';
  res.status(200).json({
    message: 'Pitt SSO login stub',
    next: 'Call callback endpoint with a code to simulate SSO success',
    callbackExample: `/auth/pitt/callback?code=mock-auth-code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`,
  });
});

app.get('/auth/pitt/callback', async (req, res) => {
  const { code, username } = req.query;
  if (!code) {
    return res.status(400).json({ message: 'Missing SSO code' });
  }

  // Derive a stable `sub` per username so each unique login = a distinct
  // student row. Falls back to the original hardcoded student when no
  // username is provided (preserves the original stub behavior).
  const cleanUsername = (username || 'pitt.student').toString().trim().toLowerCase();
  const sub = username ? `pitt-${cleanUsername}` : 'pitt-user-12345';

  const user = {
    sub,
    username: cleanUsername,
    email: `${cleanUsername}@pitt.edu`,
    provider: 'pitt-sso-stub',
  };

  // Upsert the student row so login actually touches the database.
  // Best-effort: if the DB upsert fails we still return the JWT so the
  // demo isn't blocked by a transient DB error.
  let dbRow = null;
  try {
    const upsert = await pool.query(
      `INSERT INTO students (pitt_sub, username, email, provider, last_login_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (pitt_sub) DO UPDATE
         SET username = EXCLUDED.username,
             email = EXCLUDED.email,
             provider = EXCLUDED.provider,
             last_login_at = NOW()
       RETURNING *`,
      [user.sub, user.username, user.email, user.provider]
    );
    dbRow = upsert.rows[0];
  } catch (err) {
    console.error('[auth] failed to upsert student row:', err.message);
  }

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return res.status(200).json({
    message: 'SSO callback stub successful',
    accessToken: token,
    tokenType: 'Bearer',
    user,
    student: dbRow,
  });
});

// Debug endpoint to show all student rows (no auth, demo-friendly).
app.get('/students', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, pitt_sub, username, email, provider, last_login_at, created_at FROM students ORDER BY id'
    );
    return res.status(200).json({ count: result.rows.length, students: result.rows });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing Bearer token' });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.use('/workouts', requireAuth, workoutsRouter);
app.use('/meals', requireAuth, mealsRouter);

app.get('/goals', requireAuth, (req, res) =>
  res.status(200).json({
    message: 'Authenticated goals route',
    user: req.user,
    data: [],
  })
);

app.get('/db-ping', async (req, res) => {
  const TIMEOUT_MS = 5000;
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('db_timeout')), TIMEOUT_MS)
  );
  try {
    const result = await Promise.race([pool.query('SELECT NOW()'), timeout]);
    res.status(200).json({ connected: true, time: result.rows[0].now });
  } catch (err) {
    if (err.message === 'db_timeout') {
      return res.status(503).json({
        connected: false,
        error: 'Database connection timed out — Render may be cold-starting. Retry in a few seconds.',
      });
    }
    res.status(500).json({ connected: false, error: err.message });
  }
});

// POST /goals - Create a new goal (requires auth and validation)
app.post('/goals', requireAuth, validateBody(['type', 'target']), (req, res) =>
  res.status(201).json({
    message: 'Goal created',
    data: req.body,
  })
);

// Global error handler - catches any unhandled errors in the app
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = {
  app,
  requireAuth,
  validateBody,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
