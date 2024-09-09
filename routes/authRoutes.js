const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// NO AUTH ROUTES
router.post('/login', authController.loginUser);

// AUTH ROUTES
router.post('/logout', authController.verifyToken, authController.logoutUser)

module.exports = router;

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login endpoint
 *     tags: [Authorization]
 *     requestBody:
 *       required: true
 *       description: A JSON object containing the login and password.
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
 *       400:
 *         description: Bad request - Invalid or missing autorization token
 */