const workoutModel = require('../models/workoutModel');
const userModel = require('../models/userModel');

// Fetch all workouts
const getWorkouts = async (req, res) => {
  const userId = req.query.user_id;
  let status = req.query.status?.match(/^(planned|in_progress|completed|skipped)$/i) ? req.query.status : null;
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

// Create new workout
const postWorkout = async (req, res) => {
  const { related_workout_id, name, exercises, date, notes } = req.body;

  // You can only create new workout for yourself
  const user_id = req.userId;

  // Validate if required parameters are present in request
  if (!name || !exercises || !date) return res.status(400).json({ error: 'One or more required parameters is missing' });

  // Validate date
  if (isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // TODO: VALIDATE EXERCISES DATA

  try {
    // Serialize exercises array into JSON string
    const parsedExercises = JSON.stringify(exercises);

    // Create new workout in the database
    const newWorkout = await workoutModel.postWorkout(related_workout_id, user_id, name, parsedExercises, date, notes);

    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error creating new workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const patchWorkout = async (req, res) => {
  // TODO: Implement PATCH /api/workouts/{id}

  res.status(501).json({ error: 'Not implemented' });
};

const deleteWorkout = async (req, res) => {
  // TODO: Implement DELETE /api/workouts/{id}

  res.status(501).json({ error: 'Not implemented' });
};


module.exports = {
  getWorkouts,
  getWorkoutById,
  postWorkout,
  patchWorkout,
  deleteWorkout
};