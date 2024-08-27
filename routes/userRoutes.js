const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);

module.exports = router;