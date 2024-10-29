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