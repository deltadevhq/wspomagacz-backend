const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activitiesController');
const activitiesSchema = require('../schemas/activitiesSchema'); 
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', validateInput(activitiesSchema.fetchActivitiesSchema, 'query'), verifyToken, activitiesController.fetchActivities);
router.get('/friends', validateInput(activitiesSchema.fetchFriendsActivitiesSchema, 'query'), verifyToken, activitiesController.fetchFriendsActivities);
router.get('/:id', verifyToken, activitiesController.fetchActivity);
router.delete('/:id', verifyToken, activitiesController.deleteActivity);
router.post('/:id/like', verifyToken, activitiesController.likeActivity);
router.post('/:id/unlike', verifyToken, activitiesController.unlikeActivity);

// TODO: ACTIVITIES ENDPOINTS DATA VALIDATION

module.exports = router;