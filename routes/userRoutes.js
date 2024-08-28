const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// NO AUTH ROUTES
router.post('/', userController.postUser);

// AUTH ROUTES
router.get('/:id', authController.verifyToken, userController.getUser);


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
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: int
 *                       example: 3
 *                     username:
 *                       type: string
 *                       example: "testowicz"
 *                     email:
 *                       type: string
 *                       example: "testowicz@test.com"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 * /api/users:
 *   post:
 *     summary: User register endpoint
 *     tags: [User Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - displayName
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: testowicz
 *               displayName:
 *                 type: string
 *                 example: Test
 *               password:
 *                 type: string
 *                 example: Test123!
 *               email:
 *                 type: email
 *                 example: testowicz@test.com
 *     responses:
 *       201:
 *         description: A successful register
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: int
 *                       example: 3
 *                     username:
 *                       type: string
 *                       example: "testowicz"
 *                     email:
 *                       type: string
 *                       example: "testowicz@test.com"
 *       409:
 *         description: Email or username already taken
 */