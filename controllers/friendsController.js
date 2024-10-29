// eslint-disable-next-line no-unused-vars
const { Response, Request } = require('express');

// const friendsModel = require('../models/friendsModel');
// const userModel = require('../models/userModel');

const fetchFriends = async (req, res) => {
  try {

    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error fetching friends:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const fetchFriendRequests = async (req, res) => {
  try {

    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error fetching friend requests:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const fetchFriendsActivity = async (req, res) => {
  try {

    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error fetching friends activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const sendFriendRequest = async (req, res) => {
  try {

    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error sending friend request:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {

    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error accepting friend request:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {

    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error rejecting friend request:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeFriend = async (req, res) => {
  try {

    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error removing friend:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  fetchFriends,
  fetchFriendRequests,
  fetchFriendsActivity,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
};
