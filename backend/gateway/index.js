const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

app.use(express.json());

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

  // Stub only: in a real flow this would redirect to Pitt SSO.
  res.status(200).json({
    message: 'Pitt SSO login stub',
    next: 'Call callback endpoint with a code to simulate SSO success',
    callbackExample: `/auth/pitt/callback?code=mock-auth-code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`,
  });
});

app.get('/auth/pitt/callback', (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ message: 'Missing SSO code' });
  }

  const user = {
    sub: 'pitt-user-12345',
    username: 'pitt.student',
    email: 'pitt.student@pitt.edu',
    provider: 'pitt-sso-stub',
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return res.status(200).json({
    message: 'SSO callback stub successful',
    accessToken: token,
    tokenType: 'Bearer',
    user,
  });
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

app.get('/workouts', requireAuth, (req, res) =>
  res.status(200).json({
    message: 'Authenticated workouts route',
    user: req.user,
    data: [],
  })
);
app.get('/meals', requireAuth, (req, res) =>
  res.status(200).json({
    message: 'Authenticated meals route',
    user: req.user,
    data: [],
  })
);
app.get('/goals', requireAuth, (req, res) =>
  res.status(200).json({
    message: 'Authenticated goals route',
    user: req.user,
    data: [],
  })
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
