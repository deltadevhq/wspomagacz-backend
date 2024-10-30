const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authController = require('../controllers/authController');
const workoutSchema = require('../schemas/workoutSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', validateInput(workoutSchema.getWorkoutSchema, 'query'), authController.verifyToken, workoutController.getWorkouts);
router.get('/:id', validateInput(workoutSchema.getWorkoutByIdSchema, 'params'), authController.verifyToken, workoutController.getWorkoutById);
router.put('/', validateInput(workoutSchema.putWorkoutSchema), authController.verifyToken, workoutController.putWorkout);
router.delete('/:id', validateInput(workoutSchema.deleteWorkoutSchema, 'params'), authController.verifyToken, workoutController.deleteWorkout);
router.post('/:id/start', validateInput(workoutSchema.startWorkoutSchema, 'params'), authController.verifyToken, workoutController.startWorkout);
router.post('/:id/stop', validateInput(workoutSchema.stopWorkoutSchema, 'params'), authController.verifyToken, workoutController.stopWorkout);
router.post('/:id/finish', validateInput(workoutSchema.finishWorkoutSchema, 'params'), authController.verifyToken, workoutController.finishWorkout);

module.exports = router;