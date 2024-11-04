const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userSchema = require('../schemas/userSchema');
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

// AUTH ROUTES
router.get('/search', validateInput(userSchema.searchUserProfileSchema, 'query'), verifyToken, userController.searchUserProfile);
router.patch('/:id', validateInput(userSchema.patchUserSchema, '{ id: req.params.id, ...req.body }'), verifyToken, userController.patchUser);
router.delete('/:id', validateInput(userSchema.deleteUserSchema, 'params'), verifyToken,  userController.deleteUser);
router.get('/:id/achievements', validateInput(userSchema.fetchUserAchievements, 'params'), verifyToken, userController.fetchUserAchievements);
router.get('/:id/achievements/:achievement_id', validateInput(userSchema.fetchUserAchievementById, 'params'), verifyToken, userController.fetchUserAchievementById);

module.exports = router;