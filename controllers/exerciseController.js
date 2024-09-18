const exerciseModel = require('../models/exerciseModel');
const userModel = require('../models/userModel');

// Fetch all exercises
const getExercises = async (req, res) => {
  const user_id = req.query.user_id ? Number(req.query.user_id) : null;
  let type = req.query.type?.match(/^(all|custom|standard)$/i) ? req.query.type : null;

  try {
    // Validate user_id if provided
    if (user_id) {
      if (isNaN(user_id) || user_id <= 0) return res.status(400).json({ error: 'Invalid user ID' });

      // Check user existence
      const user = await userModel.getUserById(user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
    }

    // Fetch exercises from database
    const exercises = await exerciseModel.getExercises(user_id, type);

    // Check if anything was returned
    if (!exercises) return res.status(404).json({ error: 'Exercises not found' });

    // Successful response with all exercises
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error getting exercises:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch single exercise by its ID
const getExerciseById = async (req, res) => {
  const exercise_id = Number(req.params.id);
  const user_id = req.query.user_id ? Number(req.query.user_id) : null;
  let type = req.query.type?.match(/^(all|custom|standard)$/i) ? req.query.type : null;

  // Validate exercise ID
  if (isNaN(exercise_id) || exercise_id <= 0) return res.status(400).json({ error: 'Invalid exercise ID' });

  try {
    // Validate user_id if provided
    if (user_id) {
      if (isNaN(user_id) || user_id <= 0) return res.status(400).json({ error: 'Invalid user ID' });

      // Check user existence
      const user = await userModel.getUserById(user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
    }

    // Fetch exercise from database
    const exercise = await exerciseModel.getExerciseById(exercise_id, user_id, type);

    // Check if anything was returned
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    // Successful response with selected exercise
    res.status(200).json(exercise);
  } catch (error) {
    console.error('Error getting exercise by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Post new exercise
const postExercise = async (req, res) => {
  const { name, equipment, muscles } = req.body;

  // Validation for missing parameters
  if (!name || !equipment || !muscles) return res.status(400).json({ error: 'One or more required parameters is missing' });

  // Serialize equipment and muscles arrays into JSON strings
  const parsed_equipment = JSON.stringify(equipment);
  const parsed_muscles = JSON.stringify(muscles);

  try {
    // Create new exercise in the database
    const new_exercise = await exerciseModel.postExercise(req.user_id, name, parsed_equipment, parsed_muscles);

    // Successful response with created exercise data
    res.status(201).json(new_exercise);
  } catch (error) {
    console.error('Error creating new exercise:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete exercise
const deleteExercise = async (req, res) => {
  const exercise_id = Number(req.params.id);

  // Validate exercise ID
  if (isNaN(exercise_id) || exercise_id <= 0) return res.status(400).json({ error: 'Invalid exercise ID' });

  try {
    // Fetch exercise details to check existence and ownership
    const exercise = await exerciseModel.getExerciseById(exercise_id, null, 'custom');
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    // Check if the exercise belongs to the currently logged-in user
    if (exercise.user_id !== req.user_id) return res.status(403).json({ error: 'Token does not have the required permissions' });

    // Delete exercise from database
    await exerciseModel.deleteExercise(exercise_id);

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