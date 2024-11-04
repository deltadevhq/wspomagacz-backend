// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');
const friendsModel = require('../models/friendsModel');
const userModel = require('../models/userModel');

/**
 * Handles requests to fetch the list of friends for a user.
 *
 * @param {Request} req - The request object containing the logged-in user's ID in the body.
 * @param {Response} res - The response object to return the list of friends or an error message.
 * @returns {void} - Responds with the list of friends on success or an error message if the fetch fails.
 */
const fetchFriends = async (req, res) => {
  try {
    const { logged_user_id } = req.body;

    // Fetch friends user profile
    const friends = await friendsModel.selectFriends(logged_user_id);
    if (!friends) return res.status(404).json({ error: 'No friends found.' });

    res.status(200).json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles requests to fetch pending friend requests for a user.
 *
 * @param {Request} req - The request object containing the logged-in user's ID in the body.
 * @param {Response} res - The response object to return the list of friend requests or an error message.
 * @returns {void} - Responds with the list of pending friend requests on success or an error message if the fetch fails.
 */
const fetchFriendRequests = async (req, res) => {
  try {
    const { logged_user_id } = req.body;

    // Fetching pending friend requests
    const friendRequests = await friendsModel.selectFriendRequests(logged_user_id);
    if (!friendRequests) return res.status(404).json({ error: 'No friend requests found.' });

    res.status(200).json(friendRequests);
  } catch (error) {
    console.error('Error fetching friend requests:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles requests to send a friend request to another user.
 *
 * @param {Request} req - The request object containing the recipient's ID in the URL parameters and the logged-in user's ID in the body.
 * @param {Response} res - The response object to send back the result of the friend request operation.
 * @returns {void} - Responds with the newly created friend request on success or an error message if sending fails.
 */
const sendFriendRequest = async (req, res) => {
  try {
    const { to_id } = req.params;
    const { logged_user_id } = req.body;

    // Check if sender and receiver IDs are different
    if (logged_user_id === Number(to_id)) return res.status(400).json({ error: 'You cannot send a friend request to yourself.' });

    // Check user existence
    const user = await userModel.selectUserById(to_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if request is not duplicated
    const duplicatedRequest = await friendsModel.checkFriendRequestExists(logged_user_id, to_id);
    if (duplicatedRequest) {
      if (duplicatedRequest.direction === 'sent') {
        return res.status(400).json({ error: 'You have already sent a friend request to this user.' });
      } else {
        return res.status(400).json({ error: 'This user has already sent you a friend request.' });
      }
    }

    // Check if request is not rejected
    const rejectedRequest = await friendsModel.checkFriendRequestExists(logged_user_id, to_id, 'rejected');
    if (rejectedRequest.direction === 'sent') return res.status(400).json({ error: 'You have already sent a friend request to this user.' });

    // Send the friend request
    const newRequest = await friendsModel.insertFriendRequest(logged_user_id, to_id);

    // Respond with the newly created request
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error sending friend request:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles requests to accept a friend request from another user.
 *
 * @param {Request} req - The request object containing the sender's ID in the URL parameters and the logged-in user's ID in the body.
 * @param {Response} res - The response object to send back the result of the acceptance operation.
 * @returns {void} - Responds with the updated request details on success or an error message if acceptance fails.
 */
const acceptFriendRequest = async (req, res) => {
  try {
    const { from_id } = req.params;
    const { logged_user_id } = req.body;

    // Check if sender and receiver IDs are different
    if (logged_user_id === Number(from_id)) return res.status(400).json({ error: 'You cannot accept your own friend request.' });

    // Check if the friend request exists
    const existingRequest = await friendsModel.checkFriendRequestExists(logged_user_id, from_id);
    if (!existingRequest) return res.status(404).json({ error: 'No pending friend request found from this user.' });

    // Check if the logged user sent the request
    if (existingRequest.direction === 'sent') return res.status(400).json({ error: 'You cannot accept your own friend request.' });

    // Accept the friend request
    const updatedRequest = await friendsModel.updateFriendRequestWithAcceptance(from_id, logged_user_id);
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error accepting friend request:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles requests to reject a friend request from another user.
 *
 * @param {Request} req - The request object containing the sender's ID in the URL parameters and the logged-in user's ID in the body.
 * @param {Response} res - The response object to send back the result of the rejection operation.
 * @returns {void} - Responds with the updated request details on success or an error message if rejection fails.
 */
const rejectFriendRequest = async (req, res) => {
  try {
    const { from_id } = req.params;
    const { logged_user_id } = req.body;

    // Check if sender and receiver IDs are different
    if (logged_user_id === Number(from_id)) return res.status(400).json({ error: 'You cannot reject your own friend request.' });

    // Check if the friend request exists
    const existingRequest = await friendsModel.checkFriendRequestExists(logged_user_id, from_id);
    if (!existingRequest) return res.status(404).json({ error: 'No pending friend request found from this user.' });

    // Check if the logged user sent the request
    if (existingRequest.direction === 'sent') return res.status(400).json({ error: 'You cannot reject your own friend request.' });

    // Reject the friend request
    const updatedRequest = await friendsModel.updateFriendRequestWithRejection(from_id, logged_user_id);
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error rejecting friend request:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handles requests to remove a friend from the user's friend list.
 *
 * @param {Request} req - The request object containing the friend's ID in the URL parameters and the logged-in user's ID in the body.
 * @param {Response} res - The response object to send back the result of the removal operation.
 * @returns {void} - Responds with a success message or an error message based on the operation outcome.
 */
const removeFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const { logged_user_id } = req.body;

    // Check if sender and receiver IDs are different
    if (logged_user_id === Number(id)) return res.status(400).json({ error: 'You cannot remove yourself as a friend.' });

    // Check if the friend request exists
    const existingRequest = await friendsModel.checkFriendRequestExists(logged_user_id, id);

    // Handle pending friend request sent by the logged user
    if (existingRequest && existingRequest.direction === 'sent') {
      const canceledRequest = await friendsModel.deleteFriendRequest(logged_user_id, id);
      if (canceledRequest) return res.status(200).json({ message: 'Friend request canceled successfully.', canceledRequest });
      return res.status(404).json({ error: 'Friend request not found or already canceled.' });
    }

    // Handle accepted friendship
    const removedFriend = await friendsModel.deleteFriend(logged_user_id, id);
    if (removedFriend) {
      return res.status(200).json({ message: 'Friend removed successfully.', removedFriend });
    } else {
      return res.status(404).json({ error: 'No friendship found to remove.' });
    }

  } catch (error) {
    console.error('Error removing friend:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  fetchFriends,
  fetchFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
}