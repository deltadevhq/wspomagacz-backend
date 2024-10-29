const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController.js');
const authController = require('../controllers/authController');
const exerciseSchema = require('../schemas/exerciseSchema.js');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', authController.verifyToken, validateInput(exerciseSchema.getExerciseSchema, 'query'), exerciseController.getExercises);
router.get('/:id', authController.verifyToken, validateInput(exerciseSchema.getExerciseByIdSchema, '{ id: req.params.id, ...req.query }'), exerciseController.getExerciseById);
router.post('/', authController.verifyToken, validateInput(exerciseSchema.postExerciseSchema), exerciseController.postExercise);
router.delete('/:id', authController.verifyToken, validateInput(exerciseSchema.deleteExerciseSchema, 'params'), exerciseController.deleteExercise);

module.exports = router;