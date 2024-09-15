const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, workoutController.getWorkouts);

module.exports = router;

// TODO: SWAGGER DOCS