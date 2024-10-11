const express = require('express');
const router = express.Router();
const muscleController = require('../controllers/muscleController');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, muscleController.getMuscles);
router.get('/:id', authController.verifyToken, muscleController.getMuscleById);


module.exports = router;

/**
 * @swagger
 * /api/muscles:
 *   get:
 *     summary: Fetch all muscle groups
 *     description: This endpoint requires authorization token
 *     tags: [Muscles]
 *     responses:
 *       200:
 *         description: Successfully retrieved muscles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllMuscles'
 *             examples:
 *               AllMuscles:
 *                 value:
 *                   - id: 1
 *                     name: "Biceps"
 *                   - id: 2
 *                     name: "Triceps"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Muscles not found (there might be no muscles in database)
 * /api/muscles/{id}:
 *   get:
 *     summary: Fetch single muscle group by its ID
 *     description: This endpoint requires authorization token
 *     tags: [Muscles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved muscle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Muscle'
 *       400:
 *         description: Bad request - Invalid muscle ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - Muscle not found
 * components:
 *   schemas:
 *     Muscle:
 *       type: object
 *       properties:
 *         id:
 *           type: int
 *           example: 1
 *         name:
 *           type: string
 *           example: "Biceps"
 */