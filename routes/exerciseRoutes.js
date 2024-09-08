const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController.js');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, exerciseController.getExercises);
router.get('/:id', authController.verifyToken, exerciseController.getExerciseById);


module.exports = router;

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get all exercises
 *     description: This endpoint requires authorization token
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: int
 *                   name:
 *                     type: string
 *                   equipment:
 *                     type: array
 *                   muscles:
 *                     type: array
 *             examples:
 *               AllExercises:
 *                 value:
 *                   - id: 1
 *                     name: "Pompki"
 *                     equipment: []
 *                     muscles: []
 *                   - id: 2
 *                     name: "Wyciskanie sztangielek chwytem neutralnym na ławce ze skosem dodatnim"
 *                     equipment: []
 *                     muscles: []
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Exercises not found (there might be no exercises in database)
 * /api/exercises/{id}:
 *   get:
 *     summary: Get single exercise
 *     description: This endpoint requires authorization token
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved exercise
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: int
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Pompki"
 *                 equipment:
 *                   type: array
 *                   example: []
 *                 muscles:
 *                   type: array
 *                   example: []
 *       400:
 *         description: Bad request - Invalid exercise ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Exercise not found
 */