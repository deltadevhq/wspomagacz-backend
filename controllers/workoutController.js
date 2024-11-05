// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const workoutModel = require('../models/workoutModel');
const userModel = require('../models/userModel');
const workoutSchema = require('../schemas/workoutSchema');
const experienceController = require('./experienceController');

/**
 * Fetches workouts based on user ID, status, and date.
 *
 * @param {Request} req - The request object containing query parameters for filtering workouts.
 * @param {Response} res - The response object used to send the fetched workouts or an error.
 * @returns {void} - Sends a response with the workouts or an error message.
 */
const fetchWorkouts = async (req, res) => {
  try {
    const { user_id, status, date, offset, limit } = req.query;

    // Check user existence if user_id is provided
    if (user_id) {
      const user = await userModel.selectUserById(user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
    }

    // Fetch workouts from database
    const workouts = await workoutModel.selectWorkouts(user_id, status, date, offset, limit);

    // Check if anything was returned
    if (!workouts) return res.status(404).json({ error: 'Workouts not found' });

    // Successful response with all workouts
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error getting workouts:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Fetches a specific workout by its ID.
 *
 * @param {Request} req - The request object containing the workout ID in the parameters.
 * @param {Response} res - The response object used to send the fetched workout or an error.
 * @returns {void} - Sends a response with the workout or an error message.
 */
const fetchWorkoutById = async (req, res) => {
  try {
    const { id: workout_id } = req.params;

    // Fetch workout from database
    const workout = await workoutModel.selectWorkoutById(workout_id);

    // Check if anything was returned
    if (!workout) return res.status(404).json({ error: 'Workouts not found' });

    // Successful response with selected workout
    res.status(200).json(workout);
  } catch (error) {
    console.error('Error getting workout by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Fetches the summary of a specific workout.
 *
 * @param {Request} req - The request object containing the logged user ID and workout ID in the parameters.
 * @param {Response} res - The response object used to send the fetched summary or an error.
 * @returns {void} - Sends a response with the workout summary or an error message.
 */
const fetchWorkoutSummary = async (req, res) => {
  try {
    const { logged_user_id } = req.body;
    const { id: workout_id } = req.params;

    // Check if workout exists
    const workout = await workoutModel.selectWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout status is completed
    if (workout.status !== 'completed') return res.status(409).json({ error: 'Workout is not completed' });

    // Fetch workout summary from database
    const workout_summary = await workoutModel.selectWorkoutSummary(workout_id);
    if (!workout_summary) return res.status(404).json({ error: 'Workout summary not found' });

    // Respond with the workout summary
    res.status(200).json(workout_summary);

  } catch (error) {
    console.error('Error fetching workout summary:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates an existing workout or creates a new one based on provided data.
 *
 * @param {Request} req - The request object containing workout details and user ID.
 * @param {Response} res - The response object used to send the updated or created workout data or an error.
 * @returns {void} - Sends a response with the updated or created workout data or an error message.
 */
const putWorkout = async (req, res) => {
  const { logged_user_id, id: workout_id, related_workout_id, name: workout_name, exercises, date, notes } = req.body;

  // Serialize exercises array into JSON string
  const parsed_exercises = JSON.stringify(exercises);

  // Check if workout date is not in the past
  const { error } = workoutSchema.isWorkoutDateNotInPast.validate({ date: date });
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Check if a workout with the same date already exists for the user
  const collided_workout = await workoutModel.checkWorkoutCollision(logged_user_id, date);
  if (collided_workout) return res.status(409).json({ error: `Workout with date '${date}' already exists for currently logged user` });

  if (workout_id) {
    try {
      // Check if workout exists
      const workout = await workoutModel.selectWorkoutById(workout_id);
      if (!workout) return res.status(404).json({ error: 'Workout not found' });

      // Check if the request is for the currently logged-in user
      if (workout.user_id !== logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

      // Check if workout is completed
      if (workout.status === 'completed') return res.status(409).json({ error: `Workout with status '${workout.status}' cannot be edited` });

      // Patch workout data in database
      const updated_workout = await workoutModel.updateWorkout(workout_id, workout_name, parsed_exercises, date, notes);

      // Successful response with updated workout data
      res.status(200).json(updated_workout);
    } catch (error) {
      console.error('Error updating workout:', error.stack);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    try {
      // Create new workout in the database
      const created_workout = await workoutModel.insertWorkout(related_workout_id, logged_user_id, workout_name, parsed_exercises, date, notes);

      // Successful response with created workout data
      res.status(201).json(created_workout);
    } catch (error) {
      console.error('Error creating new workout:', error.stack);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

/**
 * Deletes a specified workout if it exists and belongs to the logged-in user.
 *
 * @param {Request} req - The request object containing the workout ID and user ID.
 * @param {Response} res - The response object used to send a confirmation message or an error.
 * @returns {void} - Sends a response confirming the deletion or an error message.
 */
const deleteWorkout = async (req, res) => {
  try {
    const { id: workout_id } = req.params;
    const { logged_user_id } = req.body;

    // Fetch workout details to check existence and ownership
    const workout = await workoutModel.selectWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the workout belongs to the currently logged-in user
    if (workout.user_id !== logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout status is planned
    if (workout.status === 'completed' || workout.status === 'in_progress') return res.status(409).json({ error: `Workout with status '${workout.status}' cannot be deleted` });

    // Delete workout from database
    await workoutModel.deleteWorkout(workout_id);

    // Successful response confirming deletion
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Starts a specified workout if it exists, belongs to the logged-in user,
 * and is in the planned state, updating its status and start time.
 *
 * @param {Request} req - The request object containing the workout ID and user ID.
 * @param {Response} res - The response object used to send the updated workout data or an error.
 * @returns {void} - Sends a response with the updated workout or an error message.
 */
const startWorkout = async (req, res) => {
  try {
    const { id: workout_id } = req.params;
    const { logged_user_id } = req.body;

    // Check if workout exists
    const workout = await workoutModel.selectWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout status is planned
    if (workout.status !== 'planned') return res.status(409).json({ error: `Workout with status '${workout.status}' cannot be started` });

    // Check if workout date is today
    const { error } = workoutSchema.isWorkoutDateToday.validate({ date: workout.date });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Patch started_at for workout in database
    const started_workout = await workoutModel.updateWorkoutWithStart(workout_id);

    // Successful response with updated workout data
    res.status(200).json(started_workout);
  } catch (error) {
    console.error('Error starting workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Stops a specified workout if it exists, belongs to the logged-in user,
 * and is currently in progress, updating its status and stop time.
 *
 * @param {Request} req - The request object containing the workout ID and user ID.
 * @param {Response} res - The response object used to send the updated workout data or an error.
 * @returns {void} - Sends a response with the updated workout or an error message.
 */
const stopWorkout = async (req, res) => {
  try {
    const { id: workout_id } = req.params;
    const { logged_user_id } = req.body;

    // Check if workout exists
    const workout = await workoutModel.selectWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout status is in_progress
    if (workout.status !== 'in_progress') return res.status(409).json({ error: `Workout with status ${workout.status} cannot be stopped` });

    // Patch started_at for workout in database
    const stopped_workout = await workoutModel.updateWorkoutWithStop(workout_id);

    // Successful response with updated workout data
    res.status(200).json(stopped_workout);
  } catch (error) {
    console.error('Error stopping workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Finishes a specified workout if it exists, belongs to the logged-in user,
 * and is currently in progress, updating its status and finish time, and grants experience.
 *
 * @param {Request} req - The request object containing the workout ID and user ID.
 * @param {Response} res - The response object used to send the updated workout data or an error.
 * @returns {void} - Sends a response with the updated workout and granted experience or an error message.
 */
const finishWorkout = async (req, res) => {
  try {
    const { id: workout_id } = req.params;
    const { logged_user_id } = req.body;

    // Check if workout exists
    const workout = await workoutModel.selectWorkoutById(workout_id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== logged_user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout status is in_progress
    if (workout.status !== 'in_progress') return res.status(409).json({ error: `Workout with status '${workout.status}' cannot be finished` });

    // Patch finished_at for workout in database
    const finished_workout = await workoutModel.updateWorkoutWithFinish(workout_id);
    const experience_grant = await experienceController.userExperienceHandler(finished_workout);

    // Successful response with updated workout data
    res.status(200).json({ finished_workout, experience_grant });
  } catch (error) {
    console.error('Error finishing workout:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  fetchWorkouts,
  fetchWorkoutById,
  putWorkout,
  deleteWorkout,
  startWorkout,
  stopWorkout,
  finishWorkout,
  fetchWorkoutSummary,
}