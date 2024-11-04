const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController.js');
const exerciseSchema = require('../schemas/exerciseSchema.js');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', validateInput(exerciseSchema.fetchExercisesSchema, 'query'), verifyToken, exerciseController.fetchExercises);
router.get('/:id', validateInput(exerciseSchema.fetchExerciseByIdSchema, '{ id: req.params.id, ...req.query }'), verifyToken, exerciseController.fetchExerciseById);
router.post('/', validateInput(exerciseSchema.postExerciseSchema), verifyToken, exerciseController.postExercise);
router.delete('/:id', validateInput(exerciseSchema.deleteExerciseSchema, 'params'), verifyToken, exerciseController.deleteExercise);

module.exports = router;