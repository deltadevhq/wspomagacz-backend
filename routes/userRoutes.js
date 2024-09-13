const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/:id', authController.verifyToken, userController.getUser);
router.patch('/:id', authController.verifyToken, userController.patchUser);

// CONSIDER: DELETE /api/users/:id - Delete user

// ENDPOINT: GET /api/users/:user_id/exercises/:exercise_id - Retrieve an custom exercise by its ID
// ENDPOINT: POST /api/users/:user_id/exercises - Create new custom exercise

module.exports = router;

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user data
 *     description: This endpoint requires authorization token
 *     tags: [User Profile]
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
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   example: { "id": 10, "username": "testowicz", "display_name": "Test", "email": "testowicz@test.com", "gender": "Wolę nie podawać", "birthday": null, "status": "Aktywny", "level": 1, "exp": 0, "weights": [], "height": null, "last_logged_at": "2024-09-09T17:44:12.057Z", "created_at": "2024-09-08T18:19:39.627Z", "modified_at": "2024-09-09T17:44:12.057Z" }
 *       400:
 *         description: Bad request - Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - User not found
 *   patch:
 *     summary: Patch user data
 *     description: This endpoint requires authorization token
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - displayName
 *               - gender
 *               - birthday
 *               - weights
 *               - height
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: Patryk
 *               gender:
 *                 type: string
 *                 example: Mężczyzna
 *               birthday:
 *                 type: date
 *                 example: 2001-03-05
 *               weights:
 *                 type: array
 *                 example: []
 *               height:
 *                 type: int
 *                 example: 175
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully updated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   example: { "id": 10, "username": "testowicz", "display_name": "Test", "email": "testowicz@test.com", "gender": "Wolę nie podawać", "birthday": null, "status": "Aktywny", "level": 1, "exp": 0, "weights": [], "height": null, "last_logged_at": "2024-09-09T17:44:12.057Z", "created_at": "2024-09-08T18:19:39.627Z", "modified_at": "2024-09-09T17:44:12.057Z" }
 *       400:
 *         description: Bad request - Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - User not found
 */