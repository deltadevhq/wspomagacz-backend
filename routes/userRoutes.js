const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const userSchema = require('../schemas/userSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/search', authController.verifyToken, validateInput(userSchema.searchUserProfileSchema, 'query'), userController.searchUserProfile);
router.patch('/:id', authController.verifyToken, validateInput(userSchema.patchUserSchema, '{ id: req.params.id, ...req.body}'), userController.patchUser);
router.delete('/:id', authController.verifyToken, validateInput(userSchema.deleteUserSchema, 'params'), userController.deleteUser);

// TODO: Get activity feed for user
// router.get('/:id/activity', authController.verifyToken, validateInput(userSchema.getUserActivitySchema, 'params'), userController.getUserActivity);

module.exports = router;