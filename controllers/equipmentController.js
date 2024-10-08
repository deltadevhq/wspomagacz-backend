const equipmentModel = require('../models/equipmentModel');
const equipmentSchema = require('../schemas/equipmentSchema');

// Fetch all equipment
const getEquipment = async (req, res) => {
  try {
    // Fetch equipment from database
    const equipment = await equipmentModel.getEquipment();

    // Check if anything was returned
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    // Successful response with all equipment
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch single equipment by its ID
const getEquipmentById = async (req, res) => {
  // Validate params data
  const { error } = equipmentSchema.getEquipmentSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // Fetch equipment from database
    const equipment = await equipmentModel.getEquipmentById(req.params.id);

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
  getEquipment,
  getEquipmentById
};