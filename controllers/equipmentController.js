// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');

const equipmentModel = require('../models/equipmentModel');

/**
 * Function to handle requests for retrieving available equipment.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send back the results.
 * @returns {void} - Responds with an array of equipment if found, or an error message if no equipment is available.
 * @throws {Error} - Throws an error if there is an issue fetching the equipment data from the database.
 */
const fetchEquipment = async (req, res) => {
  try {
    // Fetch equipment from database
    const equipment = await equipmentModel.selectEquipment();

    // Check if anything was returned
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    // Successful response with all equipment
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Function to handle requests for retrieving a specific equipment item by its ID.
 *
 * @param {Request} req - The request object containing the equipment ID as a route parameter.
 * @param {Response} res - The response object used to send back the result.
 * @returns {void} - Responds with the equipment data if found, or an error message if the equipment is not available.
 * @throws {Error} - Throws an error if there is an issue fetching the equipment data or if an internal server error occurs.
 */
const fetchEquipmentById = async (req, res) => {
  try {
    // Fetch equipment from database
    const equipment = await equipmentModel.selectEquipmentById(req.params.id);

    // Check if anything was returned
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    // Successful response with selected equipment
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Error fetching equipment by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  fetchEquipment,
  fetchEquipmentById,
};
