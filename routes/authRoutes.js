const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// NO AUTH ROUTES
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

// AUTH ROUTES
router.get('/user', authController.verifyToken, authController.getUserByUsername)
router.post('/logout', authController.verifyToken, authController.logoutUser)

module.exports = router;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User register endpoint
 *     tags: [Authorization]
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
 *       400:
 *         description: Bad request - Invalid or missing user data
 *       409:
 *         description: Conflict - Email or username already taken
 * /api/auth/login:
 *   post:
 *     summary: User login endpoint
 *     tags: [Authorization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: testowicz
 *               password:
 *                 type: string
 *                 example: Test123!
 *     security: []
 *     responses:
 *       204:
 *         description: A successful login - sets authorization token as cookie
 *         headers: 
 *           Set-Cookie:
 *             schema: 
 *               type: string
 *               example: token=abcde12345; Path=/; Secure; HttpOnly
 *       400:
 *         description: Bad request - Invalid or missing login data
 *       401:
 *         description: Unauthorized - Invalid credentials
 * /api/auth/logout:
 *   post:
 *     summary: User logout endpoint
 *     tags: [Authorization]
 *     responses:
 *       204:
 *         description: A successful logout - removes cookie with autorization token
 *       401:
 *         description: Bad request - Invalid or missing autorization token
 * /api/auth/user:
 *   get:
 *     summary: Returns user data by token provided in cookie
 *     tags: [Authorization]
 *     responses:
 *       200:
 *         description: Successfuly retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   example: { "id": 10, "username": "testowicz", "display_name": "Test", "email": "testowicz@test.com", "gender": "Wolę nie podawać", "birthday": null, "status": "Aktywny", "level": 1, "exp": 0, "weights": [], "height": null, "last_logged_at": "2024-09-09T17:44:12.057Z", "created_at": "2024-09-08T18:19:39.627Z", "modified_at": "2024-09-09T17:44:12.057Z" }
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - User not found
 */