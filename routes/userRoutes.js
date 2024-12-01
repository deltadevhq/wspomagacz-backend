const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userSchema = require('../schemas/userSchema');
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

// AUTH ROUTES
router.get('/', validateInput(userSchema.fetchUserProfileByUsername, 'query'), verifyToken, userController.fetchUserProfileByUsername);
router.get('/:id', validateInput(userSchema.fetchUserProfileById, 'params'), verifyToken, userController.fetchUserProfileById);
router.get('/:id/avatar', validateInput(userSchema.fetchUserAvatar, 'params'), userController.fetchUserAvatar);

// User Achievements
router.get('/:id/achievements', validateInput(userSchema.fetchUserAchievements, 'params'), verifyToken, userController.fetchUserAchievements);
router.get('/:id/achievements/:achievement_id', validateInput(userSchema.fetchUserAchievementById, 'params'), verifyToken, userController.fetchUserAchievementById);

// User Statistics
router.get('/:id/exercises/:exercise_id/stats', validateInput(userSchema.fetchUserExerciseStats, 'params'), verifyToken, userController.fetchUserExerciseStats);

module.exports = router;