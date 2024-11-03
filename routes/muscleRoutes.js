const express = require('express');
const router = express.Router();
const muscleController = require('../controllers/muscleController');
const muscleSchema = require('../schemas/muscleSchema');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', verifyToken, muscleController.getMuscles);
router.get('/:id', validateInput(muscleSchema.getMuscleSchema, 'params'), verifyToken, muscleController.getMuscleById);

module.exports = router;