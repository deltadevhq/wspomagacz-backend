const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const workoutSchema = require('../schemas/workoutSchema');
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

// AUTH ROUTES
router.get('/', validateInput(workoutSchema.fetchWorkoutsSchema, 'query'), verifyToken, workoutController.fetchWorkouts);
router.get('/:id', validateInput(workoutSchema.fetchWorkoutByIdSchema, 'params'), verifyToken, workoutController.fetchWorkoutById);
router.get('/:id/summary', validateInput(workoutSchema.fetchWorkoutSummarySchema, 'params'), verifyToken, workoutController.fetchWorkoutSummary);
router.put('/', validateInput(workoutSchema.putWorkoutSchema), verifyToken, workoutController.putWorkout);
router.delete('/:id', validateInput(workoutSchema.deleteWorkoutSchema, 'params'), verifyToken, workoutController.deleteWorkout);
router.post('/:id/start', validateInput(workoutSchema.startWorkoutSchema, 'params'), verifyToken, workoutController.startWorkout);
router.post('/:id/stop', validateInput(workoutSchema.stopWorkoutSchema, 'params'), verifyToken, workoutController.stopWorkout);
router.post('/:id/finish', validateInput(workoutSchema.finishWorkoutSchema, 'params'), verifyToken, workoutController.finishWorkout);

module.exports = router;