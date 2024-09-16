const workoutModel = require('../models/workoutModel');
const userModel = require('../models/userModel');

// Fetch all workouts
const getWorkouts = async (req, res) => {
  const userId = req.query.user_id;
  let status = req.query.status;
  if (status) status = status.toLowerCase();

  // TODO: CREATE FILTER ON DATE

  try {
    // Check if parameter is valid and user exists
    if (userId) {
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      const user = userModel.getUser(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      }
    }

    const workouts = await workoutModel.getWorkouts(userId, status);

    if (workouts) {
      res.status(200).json(workouts);
    } else {
      res.status(404).json({ error: 'Workouts not found' });
    }
  } catch (error) {
    console.error('Error getting workouts:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch single workout by ID
const getWorkoutById = async (req, res) => {
  const workoutId = parseInt(req.params.id);

  try {
    if (isNaN(workoutId)) {
      return res.status(400).json({ error: 'Invalid workout ID' });
    }

    const workout = await workoutModel.getWorkoutById(workoutId);

    if (workout) {
      res.status(200).json(workout);
    } else {
      res.status(404).json({ error: 'Workout not found' });
    }
  } catch (error) {
    console.error('Error getting workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getWorkouts,
  getWorkoutById
};