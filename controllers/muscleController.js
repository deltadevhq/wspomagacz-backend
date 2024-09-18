const muscleModel = require('../models/muscleModel');

// Fetch all muscles
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

// Fetch single muscle by its ID
const getMuscleById = async (req, res) => {
  const muscle_id = Number(req.params.id);

  // Validate muscle ID
  if (isNaN(muscle_id) || muscle_id <= 0) return res.status(400).json({ error: 'Invalid muscle ID' });

  try {
    // Fetch muscle from database
    const muscle = await muscleModel.getMuscleById(muscle_id);

    // Check if anything was returned
    if (!muscle) return res.status(404).json({ error: 'Muscle not found' });

    // Successful response with selected muscle
    res.status(200).json(muscle);
  } catch (error) {
    console.error('Error fetching equipment by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getMuscles,
  getMuscleById
};