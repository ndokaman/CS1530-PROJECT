CREATE TABLE IF NOT EXISTS Student (
  id SERIAL PRIMARY KEY,
  pitt_username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS WorkoutEntry (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES Student(id) ON DELETE CASCADE,
  workout_type VARCHAR(100) NOT NULL,
  duration_minutes INT NOT NULL,
  calories_burned INT,
  notes TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS MealEntry (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES Student(id) ON DELETE CASCADE,
  meal_name VARCHAR(255) NOT NULL,
  calories INT,
  protein_g DECIMAL(6,2),
  carbs_g DECIMAL(6,2),
  fat_g DECIMAL(6,2),
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Goal (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES Student(id) ON DELETE CASCADE,
  goal_type VARCHAR(100) NOT NULL,
  target_value DECIMAL(8,2),
  target_date DATE,
  is_achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS HealthLog (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES Student(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  weight_lbs DECIMAL(5,2),
  sleep_hours DECIMAL(4,2),
  water_oz INT,
  mood_score INT CHECK (mood_score BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);