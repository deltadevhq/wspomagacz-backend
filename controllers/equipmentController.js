const equipmentModel = require('../models/equipmentModel');

// Fetch all equipment
const getEquipment = async (req, res) => {
  try {
    const equipment = await equipmentModel.getEquipment();

    if (equipment) {
      res.json(equipment);
    } else {
      res.status(404).json({ error: 'Equipment not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch single equipment
const getEquipmentById = async (req, res) => {
  const equipmentId = parseInt(req.params.id);

  if (isNaN(equipmentId)) {
    return res.status(400).json({ error: 'Invalid equipment ID' });
  }

  try {
    const equipment = await equipmentModel.getEquipmentById(equipmentId);

    if (equipment) {
      res.json(equipment);
    } else {
      res.status(404).json({ error: 'Equipment not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getEquipment,
  getEquipmentById
};