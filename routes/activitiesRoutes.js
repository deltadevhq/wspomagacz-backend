const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activitiesController');
const activitiesSchema = require('../schemas/activitiesSchema'); 
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', validateInput(activitiesSchema.fetchActivitiesSchema, 'query'), verifyToken, activitiesController.fetchActivities);
router.get('/friends', validateInput(activitiesSchema.fetchFriendsActivitiesSchema, 'query'), verifyToken, activitiesController.fetchFriendsActivities);
router.get('/:id', validateInput(activitiesSchema.fetchActivitySchema, 'params'), verifyToken, activitiesController.fetchActivity);
router.delete('/:id', validateInput(activitiesSchema.deleteActivitySchema, 'params'), verifyToken, activitiesController.deleteActivity);
router.post('/:id/like', validateInput(activitiesSchema.likeActivitySchema, 'params'), verifyToken, activitiesController.likeActivity);
router.post('/:id/unlike', validateInput(activitiesSchema.unlikeActivitySchema, 'params'), verifyToken, activitiesController.unlikeActivity);

module.exports = router;