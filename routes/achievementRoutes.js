const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { verifyToken } = require('../controllers/authController');

// AUTH ROUTES
router.get('/', verifyToken, achievementController.getAchievements);

module.exports = router;