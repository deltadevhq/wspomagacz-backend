const exerciseModel = require('../models/exerciseModel');
const userModel = require('../models/userModel');


// Fetch all exercises
const getExercises = async (req, res) => {
  const user_id = req.query.user_id;
  let type = req.query.type;
  if (type) type = type.toLowerCase();

  try {
    // Check if parameter is valid and user exists
    if (user_id) {
      if (isNaN(user_id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      const user = userModel.getUserById(user_id);
      if (!user) {
        res.status(404).json({ error: 'Exercises not found' });
      }
    }

    const exercises = await exerciseModel.getExercises(user_id, type);

    if (exercises) {
      res.status(200).json(exercises);
    } else {
      res.status(404).json({ error: 'Exercises not found' });
    }
  } catch (error) {
    console.error('Error getting exercises:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch single exercise
const getExerciseById = async (req, res) => {
  const exercise_id = parseInt(req.params.id);
  const user_id = req.query.user_id;
  const type = req.query.type;

  try {
    // Check if parameters are valid
    if (isNaN(exercise_id)) {
      return res.status(400).json({ error: 'Invalid exercise ID' });
    }

    if (user_id) {
      if (isNaN(user_id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      const user = userModel.getUserById(user_id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      }
    }

    const exercise = await exerciseModel.getExerciseById(exercise_id, user_id, type);

    if (exercise) {
      res.status(200).json(exercise);
    } else {
      res.status(404).json({ error: 'Exercise not found' });
    }
  } catch (error) {
    console.error('Error getting exercise by its ID:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Post new custom exercise
const postExercise = async (req, res) => {
  const { name, equipment, muscles } = req.body;

  // You can only create new exercise for yourself
  const user_id = req.user_id;

  // Validate if required parameters are present in request
  if (!user_id || !name || !equipment || !muscles) return res.status(400).json({ error: 'One or more required parameters is missing' });

  try {
    const new_exercise = await exerciseModel.postExercise(user_id, name, equipment, muscles);

    res.status(201).json(new_exercise);
  } catch (error) {
    console.error('Error creating new exercise:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete custom exercise
const deleteExercise = async (req, res) => {
  const exercise_id = parseInt(req.params.id);

  // Check if parameters are valid
  if (isNaN(exercise_id)) {
    return res.status(400).json({ error: 'Invalid exercise ID' });
  }

  try {
    // You can only delete exercise you own
    const user_id = req.user_id;
    const exercise = await exerciseModel.getExerciseById(exercise_id, null, 'custom');

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    if (exercise.user_id != user_id) {
      return res.status(403).json({ error: 'Token does not have the required permissions' });
    }

    // Delete exercise from database
    const deleted_exercise = await exerciseModel.deleteExercise(exercise_id);

    res.status(200).json({ message: 'Exercise deleted successfully', exercise: deleted_exercise});
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