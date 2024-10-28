const workoutModel = require('../models/workoutModel');
const userModel = require('../models/userModel');
const workoutSchema = require('../schemas/workoutSchema');
const experienceController = require('./experienceController');

/**
 * Fetch all workouts
 */
const getWorkouts = async (req, res) => {

  // TODO: CREATE FILTER ON DATE

  try {
    // Check user existence if user_id is provided
    if (req.query.user_id) {
      const user = await userModel.getUserById(req.query.user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
    }

    // Fetch workouts from database
    const workouts = await workoutModel.getWorkouts(req.query.user_id, req.query.status);

    // Check if anything was returned
    if (!workouts) return res.status(404).json({ error: 'Workouts not found' });

    // Successful response with all workouts
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error getting workouts:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Fetch single workout by its ID
 */
const getWorkoutById = async (req, res) => {
  try {
    // Fetch workout from database
    const workout = await workoutModel.getWorkoutById(req.params.id);

    // Check if anything was returned
    if (!workout) return res.status(404).json({ error: 'Workouts not found' });

    // Successful response with selected workout
    res.status(200).json(workout);
  } catch (error) {
    console.error('Error getting workout by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** 
 * Create new workout or edit existing
 */
const putWorkout = async (req, res) => {
  if (req.body.id) {
    try {
      // Check if workout exists
      const workout = await workoutModel.getWorkoutById(req.body.id);
      if (!workout) return res.status(404).json({ error: 'Workout not found' });

      // Check if the request is for the currently logged-in user
      if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

      // Serialize exercises array into JSON string
      const parsed_exercises = req.body.exercises ? JSON.stringify(req.body.exercises) : JSON.stringify(workout.exercises);

      // Patch workout data in database
      const updated_workout = await workoutModel.updateWorkout(req.body.id, req.body.name, parsed_exercises, req.body.date, req.body.notes);

      // Successful response with updated workout data
      res.status(200).json(updated_workout);
    } catch (error) {
      console.error('Error updating workout:', error.stack);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Serialize exercises array into JSON string
    const parsed_exercises = JSON.stringify(req.body.exercises);

    try {
      // Create new workout in the database
      const created_workout = await workoutModel.createWorkout(req.body.related_workout_id, req.user_id, req.body.name, parsed_exercises, req.body.date, req.body.notes);

      // Successful response with created workout data
      res.status(201).json(created_workout);
    } catch (error) {
      console.error('Error creating new workout:', error.stack);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

/**
 * Delete workout by its ID
 */
const deleteWorkout = async (req, res) => {
  try {
    // Fetch workout details to check existence and ownership
    const workout = await workoutModel.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the workout belongs to the currently logged-in user
    if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Delete workout from database
    await workoutModel.deleteWorkout(req.params.id);

    // Successful response confirming deletion
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Sets the workout start time to current time
 */
const startWorkout = async (req, res) => {
  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout is finished
    if (workout.finished_at) return res.status(409).json({ error: 'Workout is already finished' });

    // Check if workout is started
    if (workout.started_at) return res.status(409).json({ error: 'Workout is already started' });

    // Check if workout date is today
    const { error } = workoutSchema.dateCheckSchema.validate({ date: workout.date });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Patch started_at for workout in database
    const started_workout = await workoutModel.startWorkout(req.params.id);

    // Successful response with updated workout data
    res.status(200).json(started_workout);
  } catch (error) {
    console.error('Error starting workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Removes the workout start time
 */
const stopWorkout = async (req, res) => {
  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout is finished
    if (workout.finished_at) return res.status(409).json({ error: 'Workout is already finished' });

    // Check if workout is not started yet
    if (!workout.started_at) return res.status(409).json({ error: 'Workout is not started yet' });

    // Check if workout date is today
    const { error } = workoutSchema.dateCheckSchema.validate({ date: workout.date });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Patch started_at for workout in database
    const stopped_workout = await workoutModel.stopWorkout(req.params.id);

    // Successful response with updated workout data
    res.status(200).json(stopped_workout);
  } catch (error) {
    console.error('Error stopping workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Sets the workout finish time to current time
 */
const finishWorkout = async (req, res) => {
  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout is finished
    if (workout.finished_at) return res.status(409).json({ error: 'Workout is already finished' });

    // Check if workout is not started yet
    if (!workout.started_at) return res.status(409).json({ error: 'Workout is not started yet' });

    // Check if workout date is today
    const { error } = workoutSchema.dateCheckSchema.validate({ date: workout.date });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Patch finished_at for workout in database
    const finished_workout = await workoutModel.finishWorkout(req.params.id);
    const experience_grant = await experienceController.userExperienceHandler(finished_workout);

    // Successful response with updated workout data
    res.status(200).json({finished_workout, experience_grant});
  } catch (error) {
    console.error('Error finishing workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  putWorkout,
  deleteWorkout,
  startWorkout,
  stopWorkout,
  finishWorkout
};