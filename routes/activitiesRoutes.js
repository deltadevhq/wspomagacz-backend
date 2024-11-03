const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activitiesController');
//const activitiesSchema = require('../schemas/activitiesSchema'); 
const { verifyToken } = require('../controllers/authController');
//const { validateInput } = require('../utilities/validation');
// TODO: Activities data validation

// AUTH ROUTES
router.get('/', verifyToken, activitiesController.getActivities);
router.get('/friends', verifyToken, activitiesController.getFriendsActivities);
router.get('/:id', verifyToken, activitiesController.getActivity);
router.delete('/:id', verifyToken, activitiesController.deleteActivity);
router.post('/:id/like', verifyToken, activitiesController.likeActivity);
router.post('/:id/unlike', verifyToken, activitiesController.unlikeActivity);

module.exports = router;