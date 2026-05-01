const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../workouts/service', () => ({
  listForUser: jest.fn(async () => []),
  create: jest.fn(async () => ({ id: 1 })),
}));

jest.mock('../meals/service', () => ({
  create: jest.fn(async () => ({ id: 1 })),
}));

jest.mock('./db', () => ({
  query: jest.fn(async () => ({ rows: [] })),
}));

function makeToken(secret) {
  return jwt.sign(
    { sub: 'pitt-user-12345', username: 'pitt.student', email: 'pitt.student@pitt.edu' },
    secret,
    { expiresIn: '1h' }
  );
}

describe('Gateway CRUD routes edge cases', () => {
  const secret = 'test-secret';

  beforeEach(() => {
    jest.resetModules();
    process.env.JWT_SECRET = secret;
  });

  it('rejects /workouts with a bad JWT', async () => {
    const { app } = require('./index');
    const res = await request(app)
      .get('/workouts')
      .set('Authorization', 'Bearer definitely-not-a-jwt');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Invalid or expired token' });
  });

  it('rejects /meals with a bad JWT', async () => {
    const { app } = require('./index');
    const res = await request(app)
      .get('/meals')
      .set('Authorization', 'Bearer definitely-not-a-jwt');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Invalid or expired token' });
  });

  it('returns 400 for POST /workouts when body is empty', async () => {
    const { app } = require('./index');
    const token = makeToken(secret);

    const res = await request(app)
      .post('/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Missing required fields: date, type, exercise, duration, intensity',
    });
  });

  it('returns 400 for POST /meals when body is empty', async () => {
    const { app } = require('./index');
    const token = makeToken(secret);

    const res = await request(app)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Missing required fields: date, mealType, name',
    });
  });
});

