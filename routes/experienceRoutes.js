const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController.js');
const authController = require('../controllers/authController');
const experienceSchema = require('../schemas/experienceSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/level-by-xp', validateInput(experienceSchema.getLevelByXpSchema, 'query'), authController.verifyToken, experienceController.getLevelByXp);
router.get('/xp-by-level', validateInput(experienceSchema.getXpByLevelSchema, 'query'), authController.verifyToken, experienceController.getXpByLevel);

module.exports = router;