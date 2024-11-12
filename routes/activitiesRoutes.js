const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activitiesController');
const activitiesSchema = require('../schemas/activitiesSchema'); 
const { verifyToken } = require('../utilities/middleware/verifyToken');
const { validateInput } = require('../utilities/middleware/validateInput');

// AUTH ROUTES
router.get('/', validateInput(activitiesSchema.fetchActivitiesSchema, 'query'), verifyToken, activitiesController.fetchActivities);
router.get('/friends', validateInput(activitiesSchema.fetchFriendsActivitiesSchema, 'query'), verifyToken, activitiesController.fetchFriendsActivities);
router.get('/:id', validateInput(activitiesSchema.fetchActivitySchema, 'params'), verifyToken, activitiesController.fetchActivity);
router.delete('/:id', validateInput(activitiesSchema.deleteActivitySchema, 'params'), verifyToken, activitiesController.deleteActivity);
router.post('/:id/like', validateInput(activitiesSchema.likeActivitySchema, 'params'), verifyToken, activitiesController.likeActivity);
router.post('/:id/unlike', validateInput(activitiesSchema.unlikeActivitySchema, 'params'), verifyToken, activitiesController.unlikeActivity);
router.post('/:id/hide', validateInput(activitiesSchema.hideActivitySchema, 'params'), verifyToken, activitiesController.hideActivity);
router.post('/:id/show', validateInput(activitiesSchema.showActivitySchema, 'params'), verifyToken, activitiesController.showActivity);

module.exports = router;