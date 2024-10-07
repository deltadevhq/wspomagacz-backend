const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// NO AUTH ROUTES
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

// AUTH ROUTES
router.get('/user', authController.verifyToken, authController.getCurrentLoggedUser);
router.get('/logout', authController.verifyToken, authController.logoutUser);

// CONSIDER: PASSWORD CHANGE ENDPOINT

module.exports = router;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Creates new user account
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
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: testowicz
 *               password:
 *                 type: string
 *                 example: Test123!
 *               email:
 *                 type: email
 *                 example: testowicz@test.com
 *     security: []
 *     responses:
 *       201:
 *         description: A successful register
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid or missing user data
 *       409:
 *         description: Conflict - Email or username already taken
 * /api/auth/login:
 *   post:
 *     summary: Logs in user with provided credentials by setting authorization token as cookie
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
 *               example: token=abcde12345; Max-Age:0; SameSite=Strict; Path=/; Secure; HttpOnly;
 *       400:
 *         description: Bad request - Invalid or missing login data
 *       401:
 *         description: Unauthorized - Invalid credentials
 * /api/auth/logout:
 *   get:
 *     summary: Logs out currently logged user by removing cookie with token
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
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - User not found
 */