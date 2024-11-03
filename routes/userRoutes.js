const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userSchema = require('../schemas/userSchema');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/search', validateInput(userSchema.searchUserProfileSchema, 'query'), verifyToken, userController.searchUserProfile);
router.patch('/:id', validateInput(userSchema.patchUserSchema, '{ id: req.params.id, ...req.body }'), verifyToken, userController.patchUser);
router.delete('/:id', validateInput(userSchema.deleteUserSchema, 'params'), verifyToken,  userController.deleteUser);
router.get('/:id/activity', validateInput(userSchema.fetchUserActivitySchema, '{ id: req.params.id, ...req.query }'), verifyToken, userController.fetchUserActivity);  // TODO: MOVE ENDPOINT TO ACTIVITIES
router.get('/:id/achievements', validateInput(userSchema.getUserAchievements, 'params'), verifyToken, userController.getUserAchievements);
router.get('/:id/achievements/:achievement_id', validateInput(userSchema.getUserAchievement, 'params'), verifyToken, userController.getUserAchievement);

module.exports = router;