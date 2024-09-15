const exerciseModel = require('../models/exerciseModel');
const userModel = require('../models/userModel');


// Fetch all exercises
const getExercises = async (req, res) => {
  const userId = req.query.user_id;
  const type = req.query.type;

  try {
    // Check if parameter is valid and user exists
    if (userId) {
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      const user = userModel.getUser(userId);
      if (!user) {
        res.status(404).json({ error: 'Exercises not found' });
      }
    }

    const exercises = await exerciseModel.getExercises(userId, type);

    if (exercises) {
      res.json(exercises);
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
  const exerciseId = parseInt(req.params.id);
  const userId = req.query.user_id;
  const type = req.query.type;

  try {
    // Check if parameters are valid
    if (isNaN(exerciseId)) {
      return res.status(400).json({ error: 'Invalid exercise ID' });
    }

    if (userId) {
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      const user = userModel.getUser(userId);
      if (!user) {
        res.status(404).json({ error: 'Exercises not found' });
      }
    }

    const exercise = await exerciseModel.getExerciseById(exerciseId, userId, type);

    if (exercise) {
      res.json(exercise);
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
  const userId = req.userId;

  // Validate if required parameters are present in request
  if (!userId || !name || !equipment || !muscles) return res.status(400).json({ error: 'One or more required parameters is missing' });

  try {
    // Create new custom exercise
    const newExercise = await exerciseModel.postExercise(userId, name, equipment, muscles);

    res.status(201).json(newExercise);
  } catch (error) {
    console.error('Error creating new exercise:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete custom exercise
const deleteExercise = async (req, res) => {
  const exerciseId = parseInt(req.params.id);

  // Check if parameters are valid
  if (isNaN(exerciseId)) {
    return res.status(400).json({ error: 'Invalid exercise ID' });
  }

  try {
    // You can only delete exercise you own
    const userId = req.userId;
    const exercise = await exerciseModel.getExerciseById(exerciseId, null, 'custom');

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    if (exercise.user_id != userId) {
      return res.status(403).json({ error: 'Token does not have the required permissions' });
    }

    // Create new custom exercise
    const removedExercise = await exerciseModel.deleteExercise(exerciseId);

    res.status(200).json({ message: 'Exercise deleted successfully', exercise: removedExercise});
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