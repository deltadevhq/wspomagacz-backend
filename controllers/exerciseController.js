// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');

const exerciseModel = require('../models/exerciseModel');
const userModel = require('../models/userModel');

/**
 * Retrieves exercises based on optional user ID and type.
 *
 * @param {Request} req - Request object with optional user ID and type query parameters.
 * @param {Response} res - Response object to send back the exercises or an error message.
 * @returns {void} - Responds with an array of exercises or an error message if no exercises are found.
 * @throws {Error} - Throws an error if:
 *   - The user ID is provided but not found.
 *   - No exercises match the query.
 *   - There is a server error during the fetch.
 */
const getExercises = async (req, res) => {
  try {
    // Check user existence if user_id is provided
    if (req.query.user_id) {
      const user = await userModel.getUserById(req.query.user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
    }

    // Fetch exercises from database
    const exercises = await exerciseModel.getExercises(req.query.user_id, req.query.type);

    // Check if anything was returned
    if (!exercises) return res.status(404).json({ error: 'Exercises not found' });

    // Successful response with all exercises
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error getting exercises:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Function to handle requests for retrieving a specific exercise by its ID.
 *
 * @param {Request} req - The request object containing the exercise ID as a route parameter and optional user ID and type as query parameters.
 * @param {Response} res - Response object to return the exercise data or an error message.
 * @returns {void} - Responds with the exercise data if found, or an error if not found.
 * @throws {Error} - Throws an error if the user does not exist (if specified), the exercise is not found, or if there is a server error.
 */
const getExerciseById = async (req, res) => {
  try {
    // Check user existence if user_id is provided
    if (req.query.user_id) {
      const user = await userModel.getUserById(req.query.user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
    }

    // Fetch exercise from database
    const exercise = await exerciseModel.getExerciseById(req.params.id, req.query.user_id, req.query.type);

    // Check if anything was returned
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    // Successful response with selected exercise
    res.status(200).json(exercise);
  } catch (error) {
    console.error('Error getting exercise by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handles requests to create a new exercise.
 *
 * @param {Request} req - Request object containing exercise details in the body.
 * @param {Response} res - Response object to return the created exercise data.
 * @returns {void} - Responds with the created exercise data on success or an error message on failure.
 * @throws {Error} - Throws an error if exercise creation fails.
 */
const postExercise = async (req, res) => {
  try {
    // Serialize equipment and muscles arrays into JSON strings
    const parsed_equipment = JSON.stringify(req.body.equipment);
    const parsed_muscles = JSON.stringify(req.body.muscles);

    // Create new exercise in the database
    const new_exercise = await exerciseModel.postExercise(req.user_id, req.body.name, parsed_equipment, parsed_muscles);

    // Successful response with created exercise data
    res.status(201).json(new_exercise);
  } catch (error) {
    console.error('Error creating new exercise:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handles requests to delete a specific exercise by ID.
 *
 * @param {Request} req - Request object containing the exercise ID as a route parameter.
 * @param {Response} res - Response object to confirm deletion or return an error message.
 * @returns {void} - Responds with a success message or an error if deletion fails.
 * @throws {Error} - Throws an error if the exercise does not exist, belongs to another user, or deletion fails.
 */
const deleteExercise = async (req, res) => {
  try {
    // Fetch exercise details to check existence and ownership
    const exercise = await exerciseModel.getExerciseById(req.params.id, null, 'custom');
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    // Check if the exercise belongs to the currently logged-in user
    if (exercise.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Delete exercise from database
    await exerciseModel.deleteExercise(req.params.id);

    // Successful response confirming deletion
    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Error deleting exercise:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getExercises,
  getExerciseById,
  postExercise,
  deleteExercise
};