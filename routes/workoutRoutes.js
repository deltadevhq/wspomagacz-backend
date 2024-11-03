const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const workoutSchema = require('../schemas/workoutSchema');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', validateInput(workoutSchema.getWorkoutSchema, 'query'), verifyToken, workoutController.getWorkouts);
router.get('/:id', validateInput(workoutSchema.getWorkoutByIdSchema, 'params'), verifyToken, workoutController.getWorkoutById);
router.put('/', validateInput(workoutSchema.putWorkoutSchema), verifyToken, workoutController.putWorkout);
router.delete('/:id', validateInput(workoutSchema.deleteWorkoutSchema, 'params'), verifyToken, workoutController.deleteWorkout);
router.post('/:id/start', validateInput(workoutSchema.startWorkoutSchema, 'params'), verifyToken, workoutController.startWorkout);
router.post('/:id/stop', validateInput(workoutSchema.stopWorkoutSchema, 'params'), verifyToken, workoutController.stopWorkout);
router.post('/:id/finish', validateInput(workoutSchema.finishWorkoutSchema, 'params'), verifyToken, workoutController.finishWorkout);

module.exports = router;