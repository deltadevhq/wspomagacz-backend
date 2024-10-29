const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authController = require('../controllers/authController');
const workoutSchema = require('../schemas/workoutSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', authController.verifyToken, validateInput(workoutSchema.getWorkoutSchema, 'query'), workoutController.getWorkouts);
router.get('/:id', authController.verifyToken, validateInput(workoutSchema.getWorkoutByIdSchema, 'params'), workoutController.getWorkoutById);
router.put('/', authController.verifyToken, validateInput(workoutSchema.putWorkoutSchema), workoutController.putWorkout);
router.delete('/:id', authController.verifyToken, validateInput(workoutSchema.deleteWorkoutSchema, 'params'), workoutController.deleteWorkout);
router.post('/:id/start', authController.verifyToken, validateInput(workoutSchema.startWorkoutSchema, 'params'), workoutController.startWorkout);
router.post('/:id/stop', authController.verifyToken, validateInput(workoutSchema.stopWorkoutSchema, 'params'), workoutController.stopWorkout);
router.post('/:id/finish', authController.verifyToken, validateInput(workoutSchema.finishWorkoutSchema, 'params'), workoutController.finishWorkout);

module.exports = router;