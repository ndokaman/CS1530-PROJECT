const express = require('express');
const WorkoutService = require('./service');

const router = express.Router();

// GET /workouts — preserves existing stub behavior
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Authenticated workouts route',
    user: req.user,
    data: [],
  });
});

// POST /workouts — create a new workout entry
router.post('/', async (req, res) => {
  const { date, type, exercise, duration, intensity, calories, notes } =
    req.body || {};

  if (!date || !type || !exercise || !duration || !intensity) {
    return res.status(400).json({
      message:
        'Missing required fields: date, type, exercise, duration, intensity',
    });
  }

  if (typeof duration !== 'number' || duration <= 0) {
    return res
      .status(400)
      .json({ message: 'duration must be a positive number' });
  }

  try {
    const workout = await WorkoutService.create(req.user.sub, {
      date,
      type,
      exercise,
      duration,
      intensity,
      calories,
      notes,
    });
    return res.status(201).json(workout);
  } catch (err) {
    console.error('Failed to create workout:', err);
    return res.status(500).json({ message: 'Failed to create workout' });
  }
});

module.exports = router;