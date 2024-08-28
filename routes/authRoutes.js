const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define routes
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
 *       401:
 *         description: Invalid credentials
 */