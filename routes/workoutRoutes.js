const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authController = require('../controllers/authController');

// AUTH ROUTES
router.get('/', authController.verifyToken, workoutController.getWorkouts);

module.exports = router;

// ENDPOINT: POST /api/workouts
// ENDPOINT: GET /api/workouts/:id
// ENDPOINT: PATCH /api/workouts/:id
// ENDPOINT: DELETE /api/workouts/:id

// TODO: SWAGGER DOCS