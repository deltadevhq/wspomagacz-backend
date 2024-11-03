const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController.js');
const experienceSchema = require('../schemas/experienceSchema');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/level-by-xp', validateInput(experienceSchema.getLevelByXpSchema, 'query'), verifyToken, experienceController.getLevelByXp);
router.get('/xp-by-level', validateInput(experienceSchema.getXpByLevelSchema, 'query'), verifyToken, experienceController.getXpByLevel);

module.exports = router;