const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const userSchema = require('../schemas/userSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/search', validateInput(userSchema.searchUserProfileSchema, 'query'), authController.verifyToken, userController.searchUserProfile);
router.patch('/:id', validateInput(userSchema.patchUserSchema, '{ id: req.params.id, ...req.body}'), authController.verifyToken, userController.patchUser);
router.delete('/:id', validateInput(userSchema.deleteUserSchema, 'params'), authController.verifyToken,  userController.deleteUser);

// TODO: Get activity feed for user
// router.get('/:id/activity', authController.verifyToken, validateInput(userSchema.getUserActivitySchema, 'params'), userController.getUserActivity);

module.exports = router;