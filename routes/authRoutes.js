const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userSchema = require('../schemas/userSchema');
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

// NO AUTH ROUTES
router.post('/login', validateInput(userSchema.loginSchema), authController.loginUser);
router.post('/register', validateInput(userSchema.registerSchema), authController.registerUser);

// AUTH ROUTES
router.get('/user', verifyToken, authController.fetchCurrentLoggedUser);
router.get('/logout', verifyToken, authController.logoutUser);
router.patch('/user/password', validateInput(userSchema.patchPasswordSchema), verifyToken, authController.patchUserPassword);

module.exports = router;