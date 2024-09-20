const workoutModel = require('../models/workoutModel');
const userModel = require('../models/userModel');

// Fetch all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.query.user_id ? Number(req.query.user_id) : null;
  let status = req.query.status?.match(/^(planned|in_progress|completed|skipped)$/i) ? req.query.status : null;

  // TODO: CREATE FILTER ON DATE

  try {
    // Validate user_id if provided
    if (user_id) {
      if (isNaN(user_id) || user_id <= 0) return res.status(400).json({ error: 'Invalid user ID' });

      // Check user existence
      const user = await userModel.getUserById(user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
    }

    // Fetch workouts from database
    const workouts = await workoutModel.getWorkouts(user_id, status);

    // Check if anything was returned
    if (!workouts) return res.status(404).json({ error: 'Workouts not found' });

    // Successful response with all workouts
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error getting workouts:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch single workout by its ID
const getWorkoutById = async (req, res) => {
  const workout_id = Number(req.params.id);

  // Validate workout ID
  if (isNaN(workout_id) || workout_id <= 0) return res.status(400).json({ error: 'Invalid workout ID' });

  try {
    // Fetch workout from database
    const workout = await workoutModel.getWorkoutById(workout_id);

    // Check if anything was returned
    if (!workout) return res.status(404).json({ error: 'Workouts not found' });

    // Successful response with selected workout
    res.status(200).json(workout);
  } catch (error) {
    console.error('Error getting workout by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new workout
const postWorkout = async (req, res) => {
  const { related_workout_id, name, exercises, date, notes } = req.body;

  // Validation for missing parameters
  if (!name || !exercises || !date) return res.status(400).json({ error: 'One or more required parameters is missing' });

  // Validate date format
  if (isNaN(Date.parse(date))) return res.status(400).json({ error: 'Invalid date format' });

  // Serialize exercises array into JSON string
  const parsed_exercises = JSON.stringify(exercises);

  // TODO: VALIDATE EXERCISES DATA

  try {
    // Create new workout in the database
    const new_workout = await workoutModel.postWorkout(related_workout_id, req.user_id, name, parsed_exercises, date, notes);

    // Successful response with created workout data
    res.status(201).json(new_workout);
  } catch (error) {
    console.error('Error creating new workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Patch workout data
const patchWorkout = async (req, res) => {
  const workout_id = Number(req.params.id);
  const { name, exercises, date, notes } = req.body;

  // Validate workout ID
  if (isNaN(workout_id) || workout_id <= 0) return res.status(400).json({ error: 'Invalid workout ID' });

  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Validate date if exists
    if (date && isNaN(Date.parse(date))) return res.status(400).json({ error: 'Invalid date format' });

    // Serialize exercises array into JSON string
    const parsed_exercises = exercises ? JSON.stringify(exercises) : JSON.stringify(workout.exercises);

    // TODO: VALIDATE EXERCISES DATA

    // Patch workout data in database
    const patched_workout = await workoutModel.patchWorkout(workout_id, name, parsed_exercises, date, notes);

    // Successful response with updated workout data
    res.status(200).json(patched_workout);
  } catch (error) {
    console.error('Error patching workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete workout
const deleteWorkout = async (req, res) => {
  const workout_id = Number(req.params.id);

  // Validate workout ID
  if (isNaN(workout_id) || workout_id <= 0) return res.status(400).json({ error: 'Invalid workout ID' });

  try {
    // Fetch workout details to check existence and ownership
    const workout = await workoutModel.getWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the workout belongs to the currently logged-in user
    if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Delete workout from database
    await workoutModel.deleteWorkout(workout_id);

    // Successful response confirming deletion
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Start workout by making update on started_at column in database
const startWorkout = async (req, res) => {
  const workout_id = Number(req.params.id);

  // Validate workout ID
  if (isNaN(workout_id) || workout_id <= 0) return res.status(400).json({ error: 'Invalid workout ID' });

  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Patch started_at for workout in database
    const started_workout = await workoutModel.startWorkout(workout_id);

    // Successful response with updated workout data
    res.status(200).json(started_workout);
  } catch (error) {
    console.error('Error starting workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Stop workout by making update on started_at column in database
const stopWorkout = async (req, res) => {
  const workout_id = Number(req.params.id);

  // Validate workout ID
  if (isNaN(workout_id) || workout_id <= 0) return res.status(400).json({ error: 'Invalid workout ID' });

  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Patch started_at for workout in database
    const stopped_workout = await workoutModel.stopWorkout(workout_id);

    // Successful response with updated workout data
    res.status(200).json(stopped_workout);
  } catch (error) {
    console.error('Error stopping workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Finish workout by making update on finished_at column in database
const finishWorkout = async (req, res) => {
  const workout_id = Number(req.params.id);

  // Validate workout ID
  if (isNaN(workout_id) || workout_id <= 0) return res.status(400).json({ error: 'Invalid workout ID' });

  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Patch finished_at for workout in database
    const finished_workout = await workoutModel.finishWorkout(workout_id);

    // Successful response with updated workout data
    res.status(200).json(finished_workout);
  } catch (error) {
    console.error('Error finishing workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  postWorkout,
  patchWorkout,
  deleteWorkout,
  startWorkout,
  stopWorkout,
  finishWorkout
};