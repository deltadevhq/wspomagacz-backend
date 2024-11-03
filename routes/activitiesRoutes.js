const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activitiesController');
const activitiesSchema = require('../schemas/activitiesSchema'); 
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', verifyToken, activitiesController.getActivities);
router.get('/friends', validateInput(activitiesSchema.getFriendsActivitiesSchema, 'query'), verifyToken, activitiesController.getFriendsActivities);
router.get('/:id', verifyToken, activitiesController.getActivity);
router.delete('/:id', verifyToken, activitiesController.deleteActivity);
router.post('/:id/like', verifyToken, activitiesController.likeActivity);
router.post('/:id/unlike', verifyToken, activitiesController.unlikeActivity);

// TODO: ACTIVITIES ENDPOINTS DATA VALIDATION

module.exports = router;