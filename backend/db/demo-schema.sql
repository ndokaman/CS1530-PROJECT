-- Demo schema used when DATABASE_URL is not configured.
-- Mirrors the columns the workouts/meals services actually insert into,
-- so the in-memory Postgres (pg-mem) can satisfy POST /workouts and /meals
-- end-to-end without a real database.

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  pitt_sub TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  provider TEXT NOT NULL,
  last_login_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workouts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  exercise TEXT NOT NULL,
  duration INTEGER NOT NULL,
  intensity TEXT NOT NULL,
  calories INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meals (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  name TEXT NOT NULL,
  calories INTEGER,
  protein NUMERIC(6,2),
  carbs NUMERIC(6,2),
  fat NUMERIC(6,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
