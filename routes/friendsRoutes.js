const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');
const authController = require('../controllers/authController');
const friendsSchema = require('../schemas/friendsSchema');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', authController.verifyToken, friendsController.fetchFriends);
router.get('/requests', authController.verifyToken, friendsController.fetchFriendRequests);
router.get('/activity', authController.verifyToken, friendsController.fetchFriendsActivity);
router.post('/request/:to_id', authController.verifyToken, validateInput(friendsSchema.sendFriendRequestSchema, 'params'), friendsController.sendFriendRequest);
router.post('/accept/:from_id', authController.verifyToken, validateInput(friendsSchema.acceptFriendRequestSchema, 'params'), friendsController.acceptFriendRequest);
router.post('/reject/:from_id', authController.verifyToken, validateInput(friendsSchema.rejectFriendRequestSchema, 'params'), friendsController.rejectFriendRequest);
router.delete('/:id', authController.verifyToken, validateInput(friendsSchema.removeFriendSchema, 'params'), friendsController.removeFriend);

module.exports = router;