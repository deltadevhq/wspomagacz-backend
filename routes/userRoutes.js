const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// NO AUTH ROUTES
router.post('/', userController.postUser);

// AUTH ROUTES
router.get('/:id', authController.verifyToken, userController.getUser);


module.exports = router;