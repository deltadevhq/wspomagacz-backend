const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController.js');
const authController = require('../controllers/authController');
const exerciseSchema = require('../schemas/exerciseSchema.js');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', validateInput(exerciseSchema.getExerciseSchema, 'query'), authController.verifyToken, exerciseController.getExercises);
router.get('/:id', validateInput(exerciseSchema.getExerciseByIdSchema, '{ id: req.params.id, ...req.query }'), authController.verifyToken, exerciseController.getExerciseById);
router.post('/', validateInput(exerciseSchema.postExerciseSchema), authController.verifyToken, exerciseController.postExercise);
router.delete('/:id', validateInput(exerciseSchema.deleteExerciseSchema, 'params'), authController.verifyToken, exerciseController.deleteExercise);

module.exports = router;