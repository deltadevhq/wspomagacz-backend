const workoutModel = require('../models/workoutModel');
const userModel = require('../models/userModel');

// Fetch all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.query.user_id;
  let status = req.query.status?.match(/^(planned|in_progress|completed|skipped)$/i) ? req.query.status : null;
  if (status) status = status.toLowerCase();

  // TODO: CREATE FILTER ON DATE

  try {
    // Check if parameter is valid and user exists
    if (user_id) {
      if (isNaN(user_id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      const user = userModel.getUser(user_id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      }
    }

    const workouts = await workoutModel.getWorkouts(user_id, status);

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
  const workout_id = parseInt(req.params.id);

  try {
    if (isNaN(workout_id)) {
      return res.status(400).json({ error: 'Invalid workout ID' });
    }

    const workout = await workoutModel.getWorkoutById(workout_id);

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
    const newWorkout = await workoutModel.postWorkout(related_workout_id, req.userId, name, parsedExercises, date, notes);

    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error creating new workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const patchWorkout = async (req, res) => {
  const workout_id = parseInt(req.params.id);
  const { name, exercises, date, started_at, finished_at, notes } = req.body;

  // Check if parameters are valid
  if (isNaN(workout_id)) {
    return res.status(400).json({ error: 'Invalid workout ID' });
  }

  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(workout_id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // You can only patch workout you own
    if (workout.user_id != req.userId) {
      return res.status(403).json({ error: 'Token does not have the required permissions' });
    }

    // Validate date if exists
    if (date && isNaN(Date.parse(date))) return res.status(400).json({ error: 'Invalid date format' });
    if (started_at && isNaN(Date.parse(started_at))) return res.status(400).json({ error: 'Invalid started_at format' });
    if (finished_at && isNaN(Date.parse(finished_at))) return res.status(400).json({ error: 'Invalid finished_at format' });

    // Serialize exercises array into JSON string
    let parsedExercises;
    if (exercises) parsedExercises = JSON.stringify(exercises);
    else parsedExercises = JSON.stringify(workout.exercises);

    // Patch workout in database
    const updatedWorkout = await workoutModel.patchWorkout(workout_id, name, parsedExercises, date, started_at, finished_at, notes);

    res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error('Error patching workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteWorkout = async (req, res) => {
  const workout_id = parseInt(req.params.id);

  // Check if parameters are valid
  if (isNaN(workout_id)) {
    return res.status(400).json({ error: 'Invalid workout ID' });
  }

  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(workout_id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // You can only delete workout you own
    if (workout.user_id != req.userId) {
      return res.status(403).json({ error: 'Token does not have the required permissions' });
    }

    // Delete workout from database
    const removedWorkout = await workoutModel.deleteWorkout(workout_id);

    res.status(200).json({ message: 'Workout deleted successfully', workout: removedWorkout });
  } catch (error) {
    console.error('Error deleting workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getWorkouts,
  getWorkoutById,
  postWorkout,
  patchWorkout,
  deleteWorkout
};