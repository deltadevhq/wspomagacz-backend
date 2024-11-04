const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const achievementSchema = require('../schemas/achievementSchema'); 
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', verifyToken, achievementController.fetchAchievements);
router.get('/:id', validateInput(achievementSchema.fetchAchievementByIdSchema, 'params'), verifyToken, achievementController.fetchAchievementById);

module.exports = router;