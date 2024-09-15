const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController.js');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, exerciseController.getExercises);
router.get('/:id', authController.verifyToken, exerciseController.getExerciseById);
router.post('/', authController.verifyToken, exerciseController.postExercise);

// ENDPOINT: POST /api/exercises - Create new custom exercise

module.exports = router;

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get all exercises
 *     description: This endpoint requires authorization token
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of user for which exercises will be shown 
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, custom, standard]
 *         description: Type of exercises which will be shown
 *     responses:
 *       200:
 *         description: Successfully retrieved exercises
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Exercises not found (there might be no exercises in database)
 *   post:
 *     summary: Create new custom exercise (You can only create exercise for currently logged user)
 *     description: This endpoint requires authorization token
 *     tags: [Exercises]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pompki
 *               equipment:
 *                 type: array
 *                 example: [ { "id": 4, "name": "Sztanga" } ]
 *               muscles:
 *                 type: array
 *                 example: [ { "id": 2, "name": "Biceps" } ]
 *     responses:
 *       201:
 *         description: Successfully created new exercise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Bad Request - One or more required parameters is missing
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 * /api/exercises/{id}:
 *   get:
 *     summary: Get single exercise
 *     description: This endpoint requires authorization token
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of user for which exercises will be shown 
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [custom, standard]
 *         description: Type of exercises which will be shown
 *     responses:
 *       200:
 *         description: Successfully retrieved exercise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Bad request - Invalid exercise ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Exercise not found
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Wyciskanie hantli"
 *         equipment:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Equipment'
 *           example: [ { id: 1, name: "Hantle" } ]
 *         muscles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Muscle'
 *           example: [ { id: 1, name: "Biceps" } ]
 *         user_id:
 *           type: integer
 *           example: 1
 *           nullable: true
 *           description: ID of user who created custom exercise, null if standard
 *         exercise_type:
 *           type: string
 *           example: "custom"
 *           enum: [standard, custom]
 */