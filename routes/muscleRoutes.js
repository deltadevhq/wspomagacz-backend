const express = require('express');
const router = express.Router();
const muscleController = require('../controllers/muscleController');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, muscleController.getMuscles);
router.get('/:id', authController.verifyToken, muscleController.getMuscleById);


module.exports = router;

// TODO: MUSCLE API SWAGGER DOCS