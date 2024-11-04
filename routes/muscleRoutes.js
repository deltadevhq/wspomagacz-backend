const express = require('express');
const router = express.Router();
const muscleController = require('../controllers/muscleController');
const muscleSchema = require('../schemas/muscleSchema');
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

// AUTH ROUTES
router.get('/', verifyToken, muscleController.fetchMuscles);
router.get('/:id', validateInput(muscleSchema.fetchMuscleByIdSchema, 'params'), verifyToken, muscleController.fetchMuscleById);

module.exports = router;