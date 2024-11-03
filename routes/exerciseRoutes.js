const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController.js');
const exerciseSchema = require('../schemas/exerciseSchema.js');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', validateInput(exerciseSchema.getExerciseSchema, 'query'), verifyToken, exerciseController.getExercises);
router.get('/:id', validateInput(exerciseSchema.getExerciseByIdSchema, '{ id: req.params.id, ...req.query }'), verifyToken, exerciseController.getExerciseById);
router.post('/', validateInput(exerciseSchema.postExerciseSchema), verifyToken, exerciseController.postExercise);
router.delete('/:id', validateInput(exerciseSchema.deleteExerciseSchema, 'params'), verifyToken, exerciseController.deleteExercise);

module.exports = router;