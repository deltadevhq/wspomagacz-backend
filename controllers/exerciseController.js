const exerciseModel = require('../models/exerciseModel');

// Fetch all exercises
const getExercises = async (req, res) => {
    try {
        const exercises = await exerciseModel.getExercises();
    
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
    if (isNaN(exerciseId)) {
        return res.status(400).json({ error: 'Invalid exercise ID' });
    }

    try {
        const exercise = await exerciseModel.getExerciseById(exerciseId);
    
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