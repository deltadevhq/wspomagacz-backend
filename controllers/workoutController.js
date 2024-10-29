// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');

const workoutModel = require('../models/workoutModel');
const userModel = require('../models/userModel');
const workoutSchema = require('../schemas/workoutSchema');
const experienceController = require('./experienceController');

/**
 * Function to handle the request for retrieving workouts based on provided query parameters.
 *
 * @param {Request} req - The request object containing query parameters: user_id, status, and date.
 * @param {Response} res - The response object used to send back the results.
 * @returns {void} - Responds with an array of workouts matching the query parameters.
 * @throws {Error} - Throws an error if there's an issue fetching workouts or if the user does not exist.
 */
const getWorkouts = async (req, res) => {
  try {
    // Check user existence if user_id is provided
    if (req.query.user_id) {
      const user = await userModel.getUserById(req.query.user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
    }

    // Fetch workouts from database
    const workouts = await workoutModel.getWorkouts(req.query.user_id, req.query.status, req.query.date);

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
 * Function to handle the request for retrieving a specific workout by its ID.
 *
 * @param {Request} req - The request object containing the workout ID as a route parameter.
 * @param {Response} res - The response object used to send back the result.
 * @returns {void} - Responds with the workout data if found.
 * @throws {Error} - Throws an error if there's an issue fetching the workout or if the workout is not found.
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
 * Function to handle requests for creating or updating a workout.
 * - If an ID is provided in the request body, the function updates the corresponding workout.
 * - If no ID is provided, a new workout is created.
 *
 * @param {Request} req - The request object containing workout data in the body and the workout ID as an optional parameter.
 * @param {Response} res - The response object used to send back the result.
 * @returns {void} - Responds with the created or updated workout data, or an error message.
 * @throws {Error} - Throws an error if:
 *   - The workout date is in the past.
 *   - A workout with the same date already exists for the user.
 *   - The workout is not found, or if it belongs to a different user.
 *   - The workout has a 'finished' status and cannot be edited.
 *   - An internal server error occurs during the update or creation process.
 */
const putWorkout = async (req, res) => {
  // Check if workout date is not in the past
  const { error } = workoutSchema.isWorkoutDateNotInPast.validate({ date: req.body.date });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const collidedWorkout = await workoutModel.checkWorkoutCollision(req.body.user_id, req.body.date);
  if (collidedWorkout) return res.status(409).json({ error: 'Workout with that date exists for currently logged user' });

  if (req.body.id) {
    try {
      // Check if workout exists
      const workout = await workoutModel.getWorkoutById(req.body.id);
      if (!workout) return res.status(404).json({ error: 'Workout not found' });

      // Check if the request is for the currently logged-in user
      if (workout.user_id !== req.body.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

      // Check if workout status is not finished
      if (workout.status === 'finished') return res.status(409).json({ error: 'You can not edit workout which status is finished' });

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
      const created_workout = await workoutModel.createWorkout(req.body.related_workout_id, req.body.user_id, req.body.name, parsed_exercises, req.body.date, req.body.notes);

      // Successful response with created workout data
      res.status(201).json(created_workout);
    } catch (error) {
      console.error('Error creating new workout:', error.stack);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

/**
 * Function to handle requests for deleting a specific workout by its ID.
 * - Checks if the workout exists, belongs to the currently logged-in user, and has an allowed status for deletion.
 *
 * @param {Request} req - The request object containing the workout ID as a route parameter.
 * @param {Response} res - The response object used to send back the result.
 * @returns {void} - Responds with a success message upon deletion or an error message if deletion is not allowed.
 * @throws {Error} - Throws an error if:
 *   - The workout is not found.
 *   - The workout belongs to a different user.
 *   - The workout status is 'completed' or 'in_progress', restricting deletion.
 *   - An internal server error occurs during the deletion process.
 */
const deleteWorkout = async (req, res) => {
  try {
    // Fetch workout details to check existence and ownership
    const workout = await workoutModel.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the workout belongs to the currently logged-in user
    if (workout.user_id !== req.body.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout status is planned
    if (workout.status === 'completed' || workout.status === 'in_progress') return res.status(409).json({ error: 'You can only delete workout which status is planned or skipped' });

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
 * Function to handle requests for starting a specific workout by its ID.
 * - Checks if the workout exists, belongs to the currently logged-in user, has a status of 'planned', and has a workout date of today.
 *
 * @param {Request} req - The request object containing the workout ID as a route parameter.
 * @param {Response} res - The response object used to send back the result.
 * @returns {void} - Responds with the updated workout data if successfully started or an error message if the request fails validation.
 * @throws {Error} - Throws an error if:
 *   - The workout is not found.
 *   - The workout belongs to a different user.
 *   - The workout status is not 'planned', restricting the start action.
 *   - The workout date is not today.
 *   - An internal server error occurs during the update process.
 */
const startWorkout = async (req, res) => {
  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.body.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout status is planned
    if (workout.status !== 'planned') return res.status(409).json({ error: 'You can only start workout which status is planned' });

    // Check if workout date is today
    const { error } = workoutSchema.isWorkoutDateToday.validate({ date: workout.date });
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
 * Function to handle requests for stopping a specific workout by its ID.
 * - Checks if the workout exists, belongs to the currently logged-in user, and has a status of 'in_progress'.
 *
 * @param {Request} req - The request object containing the workout ID as a route parameter.
 * @param {Response} res - The response object used to send back the result.
 * @returns {void} - Responds with the updated workout data if successfully stopped or an error message if the request fails validation.
 * @throws {Error} - Throws an error if:
 *   - The workout is not found.
 *   - The workout belongs to a different user.
 *   - The workout status is not 'in_progress', restricting the stop action.
 *   - An internal server error occurs during the update process.
 */
const stopWorkout = async (req, res) => {
  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.body.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout status is in_progress
    if (workout.status !== 'in_progress') return res.status(409).json({ error: 'You can only stop workout which status is in_progress' });

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
 * Function to handle requests for finishing a specific workout by its ID.
 * - Checks if the workout exists, belongs to the currently logged-in user, and has a status of 'in_progress'.
 * - Grants experience points upon successful completion.
 *
 * @param {Request} req - The request object containing the workout ID as a route parameter.
 * @param {Response} res - The response object used to send back the result.
 * @returns {void} - Responds with the updated workout data and experience points granted if successfully finished, or an error message if the request fails validation.
 * @throws {Error} - Throws an error if:
 *   - The workout is not found.
 *   - The workout belongs to a different user.
 *   - The workout status is not 'in_progress', restricting the finish action.
 *   - An internal server error occurs during the update or experience grant process.
 */
const finishWorkout = async (req, res) => {
  try {
    // Check if workout exists
    const workout = await workoutModel.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });

    // Check if the request is for the currently logged-in user
    if (workout.user_id !== req.body.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Check if workout status is in_progress
    if (workout.status !== 'in_progress') return res.status(409).json({ error: 'You can only stop workout which status is in_progress' });

    // Patch finished_at for workout in database
    const finished_workout = await workoutModel.finishWorkout(req.params.id);
    const experience_grant = await experienceController.userExperienceHandler(finished_workout);

    // Successful response with updated workout data
    res.status(200).json({ finished_workout, experience_grant });
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