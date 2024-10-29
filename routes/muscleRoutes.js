const express = require('express');
const router = express.Router();
const muscleController = require('../controllers/muscleController');
const authController = require('../controllers/authController');
const muscleSchema = require('../schemas/muscleSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', authController.verifyToken, muscleController.getMuscles);
router.get('/:id', authController.verifyToken, validateInput(muscleSchema.getMuscleSchema, 'params'), muscleController.getMuscleById);

module.exports = router;