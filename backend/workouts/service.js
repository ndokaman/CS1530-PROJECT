const pool = require('../db/pool');

const WorkoutService = {
  async create(userId, data) {
    const { date, type, exercise, duration, intensity, calories, notes } = data;
    const result = await pool.query(
      `INSERT INTO workouts
         (user_id, date, type, exercise, duration, intensity, calories, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        date,
        type,
        exercise,
        duration,
        intensity,
        calories ?? null,
        notes ?? null,
      ]
    );
    return result.rows[0];
  },
};

module.exports = WorkoutService;