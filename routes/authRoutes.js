const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userSchema = require('../schemas/userSchema');
const { validateInput } = require('../utilities/validation');

// NO AUTH ROUTES
router.post('/login', validateInput(userSchema.loginSchema), authController.loginUser);
router.post('/register', validateInput(userSchema.registerSchema), authController.registerUser);

// AUTH ROUTES
router.get('/user', authController.verifyToken, authController.getCurrentLoggedUser);
router.get('/logout', authController.verifyToken, authController.logoutUser);
router.patch('/user/password', authController.verifyToken, validateInput(userSchema.patchPasswordSchema), authController.patchUserPassword);

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
 *     description: Username provided in request body can be either email or username
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
 *         description: A successful logout - removes cookie with authorization token
 *       401:
 *         description: Bad request - Invalid or missing authorization token
 * /api/auth/user:
 *   get:
 *     summary: Returns user data by token provided in cookie
 *     tags: [Authorization]
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - User not found
 * /api/auth/user/password:
 *   patch:
 *     summary: Update user password
 *     tags: [Authorization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The current password of the user.
 *                 example: current_password123
 *               new_password:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: new_password123 
 *     responses:
 *       200:
 *         description: Successfully updated user password
 *       400:
 *         description: Bad Request - Invalid password or using the same password
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Not Found - User not found
 */