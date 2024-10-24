const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const userSchema = require('../schemas/userSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/:id', authController.verifyToken, validateInput(userSchema.getUserProfileSchema, 'params'), userController.getUserProfile);
router.patch('/:id', authController.verifyToken, validateInput(userSchema.patchUserSchema, '{ id: req.params.id, ...req.body}'), userController.patchUser);
router.delete('/:id', authController.verifyToken, validateInput(userSchema.deleteUserSchema, 'params'), userController.deleteUser)

module.exports = router;

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user profile data by its ID
 *     description: This endpoint requires authorization token
 *     tags: [User Profile]
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
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad request - Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - User not found
 *   delete:
 *     summary: Delete user by its ID (You can only delete currently logged user)
 *     description: This endpoint requires authorization token
 *     tags: [User Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "message": "User deleted successfully" }
 *       400:
 *         description: Bad request - Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - User not found
 *   patch:
 *     summary: Patch user data by its ID (You can only patch currently logged user)
 *     description: Only display_name, gender, birthday, weights and height can be updated through this endpoint
 *     tags: [User Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: Test User
 *                 nullable: true
 *               gender:
 *                 type: string
 *                 example: Male
 *                 enum: [Male, Female, Not specified]
 *                 nullable: true
 *               birthday:
 *                 type: date
 *                 example: 2001-03-05
 *                 nullable: true
 *               weights:
 *                 type: array
 *                 example: [ { "weight": 75, "date": "2024-09-08" } ]
 *                 items:
 *                   type: object
 *                   properties:
 *                     weight:
 *                       type: float
 *                       example: 75
 *                       minimum: 0
 *                       nullable: true
 *                     date:
 *                       type: date
 *                       example: 2024-09-08
 *                       nullable: true
 *                 nullable: true
 *               height:
 *                 type: integer
 *                 example: 175
 *                 nullable: true
 *                 minimum: 0
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
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have the required permissions
 *       404:
 *         description: Not Found - User not found
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         username:
 *           type: string
 *           example: test_user
 *         display_name:
 *           type: string
 *           example: Test User
 *         email:
 *           type: string
 *           example: test@user.com
 *         gender:
 *           type: string
 *           example: Male
 *           enum: [Male, Female, Not specified]
 *         birthday:
 *           type: date
 *           example: 2001-03-05
 *           nullable: true
 *         status:
 *           type: string
 *           example: Aktywny
 *           enum: [Aktywny, Nieaktywny, Zawieszony]
 *         level:
 *           type: integer
 *           example: 1
 *           minimum: 1
 *         exp:
 *           type: integer
 *           example: 0
 *           minimum: 0
 *         weights:
 *           type: array
 *           example: [ { "weight": 75, "date": "2024-09-08" } ]
 *           items:
 *             type: object
 *             properties:
 *               weight:
 *                  type: integer
 *                  example: 75
 *               date:
 *                 type: date
 *                 example: 2024-09-08
 *         height:
 *           type: integer
 *           example: 175
 *           nullable: true
 *         last_logged_at:
 *           type: date
 *           example: 2024-09-09T17:44:12.057Z
 *           nullable: true
 *           description: Last time user logged in
 *           format: date-time
 *         created_at:
 *           type: date
 *           example: 2024-09-08T18:19:39.627Z
 *           format: date-time
 *           description: User account creation date
 *         modified_at:
 *           type: date
 *           example: 2024-09-09T17:44:12.057Z
 *           format: date-time
 *           description: Last time user data was modified
 *           nullable: true
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         username:
 *           type: string
 *           example: test_user
 *         display_name:
 *           type: string
 *           example: Test User
 *         gender:
 *           type: string
 *           example: Male
 *           enum: [Male, Female, Not specified]
 *         birthday:
 *           type: date
 *           example: 2001-03-05
 *           nullable: true
 *         status:
 *           type: string
 *           example: Aktywny
 *           enum: [Aktywny, Nieaktywny, Zawieszony]
 *         level:
 *           type: integer
 *           example: 1
 *           minimum: 1
 *         exp:
 *           type: integer
 *           example: 0
 *           minimum: 0
 *         weights:
 *           type: array
 *           example: [ { "weight": 75, "date": "2024-09-08" } ]
 *           items:
 *             type: object
 *             properties:
 *               weight:
 *                  type: integer
 *                  example: 75
 *               date:
 *                 type: date
 *                 example: 2024-09-08
 *         height:
 *           type: integer
 *           example: 175
 *           nullable: true
 */