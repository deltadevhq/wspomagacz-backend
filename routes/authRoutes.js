const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userSchema = require('../schemas/userSchema');
const { upload } = require('../utilities/middleware/fileUpload');
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

// NO AUTH ROUTES
router.post('/login', validateInput(userSchema.loginSchema), authController.loginUser);
router.post('/register', validateInput(userSchema.registerSchema), authController.registerUser);

// AUTH ROUTES
router.get('/logout', verifyToken, authController.logoutUser);
router.get('/user', verifyToken, authController.fetchCurrentLoggedUser);
router.delete('/user', verifyToken,  authController.deleteUser);
router.patch('/user', validateInput(userSchema.patchUserSchema), verifyToken, authController.patchUser);
router.patch('/user/avatar', upload.single('avatar'), verifyToken, authController.patchUserAvatar);
router.patch('/user/password', validateInput(userSchema.patchPasswordSchema), verifyToken, authController.patchUserPassword);
// TODO: router.post('/user/password/reset', verifyToken, authController.resetUserPassword);

module.exports = router;