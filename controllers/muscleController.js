const muscleModel = require('../models/muscleModel');

// Fetch all muscles
const getMuscles = async (req, res) => {
  try {
    const muscles = await muscleModel.getMuscles();

    if (muscles) {
      res.status(200).json(muscles);
    } else {
      res.status(404).json({ error: 'Muscles not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch single muscle
const getMuscleById = async (req, res) => {
  const muscleId = parseInt(req.params.id);

  if (isNaN(muscleId)) {
    return res.status(400).json({ error: 'Invalid muscle ID' });
  }

  try {
    const muscle = await muscleModel.getMuscleById(muscleId);

    if (muscle) {
      res.status(200).json(muscle);
    } else {
      res.status(404).json({ error: 'Muscle not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getMuscles,
  getMuscleById
};