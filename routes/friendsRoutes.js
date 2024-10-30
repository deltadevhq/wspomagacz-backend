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
router.post('/request/:to_id', validateInput(friendsSchema.sendFriendRequestSchema, 'params'), authController.verifyToken, friendsController.sendFriendRequest);
router.post('/accept/:from_id', validateInput(friendsSchema.acceptFriendRequestSchema, 'params'), authController.verifyToken, friendsController.acceptFriendRequest);
router.post('/reject/:from_id', validateInput(friendsSchema.rejectFriendRequestSchema, 'params'), authController.verifyToken, friendsController.rejectFriendRequest);
router.delete('/:id', validateInput(friendsSchema.removeFriendSchema, 'params'), authController.verifyToken, friendsController.removeFriend);

module.exports = router;