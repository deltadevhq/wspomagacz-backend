const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, workoutController.getWorkouts);
router.post('/', authController.verifyToken, workoutController.postWorkout);
router.get('/:id', authController.verifyToken, workoutController.getWorkoutById);
router.patch('/:id', authController.verifyToken, workoutController.patchWorkout);
router.delete('/:id', authController.verifyToken, workoutController.deleteWorkout);
router.post('/:id/start', authController.verifyToken, workoutController.startWorkout);
router.post('/:id/finish', authController.verifyToken, workoutController.finishWorkout);

module.exports = router;

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get all workouts
 *     description: This endpoint requires authorization token
 *     tags: [Workouts]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: false
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [completed, in_progress, planned, skipped]
 *     responses:
 *       200:
 *         description: Successfully retrieved all workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - No workouts found
 *   post:
 *     summary: Create a new workout
 *     description: This endpoint requires authorization token
 *     tags: [Workouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workout'
 *     responses:
 *       201:
 *         description: Successfully created a new workout
 *       400:
 *         description: Bad request - Invalid workout data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 * /api/workouts/{id}:
 *   get:
 *     summary: Get workout data
 *     description: This endpoint requires authorization token
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Successfully retrieved workout data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Bad request - Invalid workout ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Workout not found
 *   patch:
 *     summary: Patch workout data
 *     description: This endpoint requires authorization token, you can only patch workout for currently logged user
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Arm day'
 *                 nullable: true
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       $ref: '#/components/schemas/Exercise'
 *                     sets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           reps:
 *                             type: integer
 *                             example: 10
 *                             minimum: 0
 *                           weight:
 *                             type: float
 *                             example: 75
 *                             minimum: 0
 *                             nullable: true
 *                           order:
 *                             type: integer
 *                             example: 1
 *                             minimum: 0
 *                     order:
 *                       type: integer
 *                       example: 1
 *                       minimum: 0
 *               date:
 *                 type: date
 *                 example: 2024-09-08
 *                 nullable: true
 *               started_at:
 *                 type: date
 *                 example: 2024-09-08T10:00:00
 *                 nullable: true
 *               finished_at:
 *                 type: date
 *                 example: 2024-09-08T11:00:00
 *                 nullable: true
 *               notes:
 *                 type: string
 *                 example: 'Great workout!'
 *     responses:
 *       200:
 *         description: Successfully updated workout data
 *       400:
 *         description: Bad request - Invalid workout ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Workout not found
 *   delete:
 *     summary: Delete workout
 *     description: This endpoint requires authorization token, you can only delete workout for currently logged user
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Successfully deleted workout
 *       400:
 *         description: Bad request - Invalid workout ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Workout not found
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           minimum: 0
 *         related_workout_id:
 *           type: integer
 *           example: null
 *         user_id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: 'Arm day'
 *         exercises:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               exercise:
 *                 $ref: '#/components/schemas/Exercise'
 *               sets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     reps:
 *                       type: integer
 *                       example: 10
 *                       minimum: 0
 *                     weight:
 *                       type: float
 *                       example: 75
 *                       minimum: 0
 *                       nullable: true
 *                     order:
 *                       type: integer
 *                       example: 1
 *                       minimum: 0
 *               order:
 *                 type: integer
 *                 example: 1
 *                 minimum: 0
 *         date:
 *           type: date
 *           example: 2024-09-08
 *         started_at:
 *           type: date
 *           example: 2024-09-08T10:00:00
 *           nullable: true
 *         finished_at:
 *           type: date
 *           example: 2024-09-08T11:00:00
 *           nullable: true
 *         status:
 *           type: string
 *           example: completed
 *           enum: [completed, in_progress, planned, skipped]
 *         notes:
 *           type: string
 *           example: 'Great workout!'
 */
