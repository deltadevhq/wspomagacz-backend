const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController.js');
const authController = require('../controllers/authController');
const experienceSchema = require('../schemas/experienceSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/level-by-xp', authController.verifyToken, validateInput(experienceSchema.getLevelByXpSchema, 'query'), experienceController.getLevelByXp);
router.get('/xp-by-level', authController.verifyToken, validateInput(experienceSchema.getXpByLevelSchema, 'query'), experienceController.getXpByLevel);

module.exports = router;