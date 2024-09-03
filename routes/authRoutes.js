const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// NO AUTH ROUTES
router.post('/login', authController.loginUser);

module.exports = router;

/**
 * @swagger
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
 *     responses:
 *       201:
 *         description: A successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request - Invalid or missing login data
 *       401:
 *         description: Unauthorized - Invalid credentials
 */