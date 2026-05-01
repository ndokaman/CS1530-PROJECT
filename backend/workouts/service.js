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

  async listForUser(userId) {
    const result = await pool.query(
      `SELECT id, user_id, date, type, exercise, duration, intensity,
              calories, notes, created_at
         FROM workouts
        WHERE user_id = $1
        ORDER BY date DESC, id DESC`,
      [userId]
    );
    return result.rows;
  },
};

module.exports = WorkoutService;