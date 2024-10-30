// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');

const muscleModel = require('../models/muscleModel');

/**
 * Function to handle requests for retrieving available muscle groups.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send back the results.
 * @returns {void} - Responds with an array of muscle groups if found, or an error message if no muscles are available.
 * @throws {Error} - Throws an error if there is an issue fetching the muscle data from the database.
 */
const getMuscles = async (req, res) => {
  try {
    // Fetch muscles from database
    const muscles = await muscleModel.getMuscles();

    // Check if anything was returned
    if (!muscles) return res.status(404).json({ error: 'Muscles not found' });

    // Successful response with all muscles
    res.status(200).json(muscles);
  } catch (error) {
    console.error('Error fetching muscles:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Function to handle requests for retrieving a specific muscle group by its ID.
 *
 * @param {Request} req - The request object containing the muscle ID as a route parameter.
 * @param {Response} res - The response object used to send back the result.
 * @returns {void} - Responds with the muscle group data if found, or an error message if the muscle is not available.
 * @throws {Error} - Throws an error if there is an issue fetching the muscle data from the database.
 */
const getMuscleById = async (req, res) => {
  try {
    // Fetch muscle from database
    const muscle = await muscleModel.getMuscleById(req.params.id);

    // Check if anything was returned
    if (!muscle) return res.status(404).json({ error: 'Muscle not found' });

    // Successful response with selected muscle
    res.status(200).json(muscle);
  } catch (error) {
    console.error('Error fetching muscles by their ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getMuscles,
  getMuscleById,
};
