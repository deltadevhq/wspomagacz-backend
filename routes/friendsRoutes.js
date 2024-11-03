const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');
const friendsSchema = require('../schemas/friendsSchema');
const { verifyToken } = require('../controllers/authController');
const { validateInput } = require('../utilities/validation');

// AUTH ROUTES
router.get('/', verifyToken, friendsController.fetchFriends);
router.get('/requests', verifyToken, friendsController.fetchFriendRequests);
router.post('/request/:to_id', validateInput(friendsSchema.sendFriendRequestSchema, 'params'), verifyToken, friendsController.sendFriendRequest);
router.post('/accept/:from_id', validateInput(friendsSchema.acceptFriendRequestSchema, 'params'), verifyToken, friendsController.acceptFriendRequest);
router.post('/reject/:from_id', validateInput(friendsSchema.rejectFriendRequestSchema, 'params'), verifyToken, friendsController.rejectFriendRequest);
router.delete('/:id', validateInput(friendsSchema.removeFriendSchema, 'params'), verifyToken, friendsController.removeFriend);

module.exports = router;