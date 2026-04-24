const express = require('express');
const MealService = require('./service');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Authenticated meals route',
    user: req.user,
    data: [],
  });
});

router.post('/', async (req, res) => {
  const { date, mealType, name, calories, protein, carbs, fat, notes } =
    req.body || {};

  if (!date || !mealType || !name) {
    return res
      .status(400)
      .json({ message: 'Missing required fields: date, mealType, name' });
  }

  try {
    const meal = await MealService.create(req.user.sub, {
      date,
      mealType,
      name,
      calories,
      protein,
      carbs,
      fat,
      notes,
    });
    return res.status(201).json(meal);
  } catch (err) {
    console.error('Failed to create meal:', err);
    return res.status(500).json({ message: 'Failed to create meal' });
  }
});

module.exports = router;