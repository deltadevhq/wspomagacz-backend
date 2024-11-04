// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const muscleModel = require('../models/muscleModel');

/**
 * Handles requests to fetch the list of muscles from the database.
 *
 * @param {Request} req - The request object to fetch muscle data.
 * @param {Response} res - The response object to return the list of muscles or an error message.
 * @returns {void} - Responds with the list of muscles on success or an error message if the fetch fails.
 */
const fetchMuscles = async (req, res) => {
  try {
    // Fetch muscles from database
    const muscles = await muscleModel.selectMuscles();

    // Check if anything was returned
    if (!muscles) return res.status(404).json({ error: 'Muscles not found' });

    // Successful response with all muscles
    res.status(200).json(muscles);
  } catch (error) {
    console.error('Error fetching muscles:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles requests to fetch a specific muscle by its ID from the database.
 *
 * @param {Request} req - The request object containing the muscle ID as a route parameter.
 * @param {Response} res - The response object to return the muscle data or an error message.
 * @returns {void} - Responds with the muscle data on success or an error message if the fetch fails.
 */
const fetchMuscleById = async (req, res) => {
  try {
    // Fetch muscle from database
    const muscle = await muscleModel.selectMuscleById(req.params.id);

    // Check if anything was returned
    if (!muscle) return res.status(404).json({ error: 'Muscle not found' });

    // Successful response with selected muscle
    res.status(200).json(muscle);
  } catch (error) {
    console.error('Error fetching muscles by their ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  fetchMuscles,
  fetchMuscleById,
}