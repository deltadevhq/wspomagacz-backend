const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, workoutController.getWorkouts);

module.exports = router;

// ENDPOINT: POST /api/workouts
// ENDPOINT: GET /api/workouts/:id
// ENDPOINT: PATCH /api/workouts/:id
// ENDPOINT: DELETE /api/workouts/:id

// TODO: SWAGGER DOCS

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
 *         schema:
 *           type: integer
 *         description: ID of user for which workouts will be shown 
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, in_progress, completed, skipped, all]
 *         description: Status of workouts which will be shown
 *     responses:
 *       200:
 *         description: Successfully retrieved workouts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Workouts not found
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         related_workout_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Push Workout"
 *         exercises:
 *           type: array
 *           example: []
 *         date:
 *           type: date
 *           example: 2024-09-09T17:44:12.057Z
 *         started_at:
 *           type: date
 *           example: 2024-09-09T17:44:12.057Z
 *         finished_at:
 *           type: date
 *           example: 2024-09-09T17:44:12.057Z
 *         status:
 *           type: string
 *           example: "planned"
 *           enum: [in_progress, planned, completed, skipped]
 *         notes:
 *           type: string
 *           example: "1st day of Push Pull Legs workout"
 */