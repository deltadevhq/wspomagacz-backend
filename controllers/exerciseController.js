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
    console.error(error.message);
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
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getExercises,
  getExerciseById
};