const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userSchema = require('../schemas/userSchema');
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

// AUTH ROUTES
router.get('/search', validateInput(userSchema.searchUserProfileSchema, 'query'), verifyToken, userController.searchUserProfile);
router.get('/:id/achievements', validateInput(userSchema.fetchUserAchievements, 'params'), verifyToken, userController.fetchUserAchievements);
router.get('/:id/achievements/:achievement_id', validateInput(userSchema.fetchUserAchievementById, 'params'), verifyToken, userController.fetchUserAchievementById);

// TODO: GET /API/USERS
// TODO: GET /API/USERS/ID

module.exports = router;