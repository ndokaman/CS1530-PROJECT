const pool = require('../db/pool');

const MealService = {
  async create(userId, data) {
    const {
      date,
      mealType,
      name,
      calories,
      protein,
      carbs,
      fat,
      notes,
    } = data;
    const result = await pool.query(
      `INSERT INTO meals
         (user_id, date, meal_type, name, calories, protein, carbs, fat, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        userId,
        date,
        mealType,
        name,
        calories ?? null,
        protein ?? null,
        carbs ?? null,
        fat ?? null,
        notes ?? null,
      ]
    );
    return result.rows[0];
  },
};

module.exports = MealService;