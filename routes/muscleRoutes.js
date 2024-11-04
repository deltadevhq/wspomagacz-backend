const express = require('express');
const router = express.Router();
const muscleController = require('../controllers/muscleController');
const muscleSchema = require('../schemas/muscleSchema');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', verifyToken, muscleController.fetchMuscles);
router.get('/:id', validateInput(muscleSchema.fetchMuscleByIdSchema, 'params'), verifyToken, muscleController.fetchMuscleById);

module.exports = router;