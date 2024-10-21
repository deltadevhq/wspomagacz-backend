const exerciseModel = require('../models/exerciseModel');
const userModel = require('../models/userModel');

/**
 * Fetch all exercises
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
 * Fetch single exercise by its ID
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
 * Create custom exercise (You can only create exercise for currently logged user)
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
 * Delete custom exercise (You can only delete exercise for currently logged user)
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