const activitiesModel = require('../models/activitiesModel');

const getActivities = async (req, res) => {
  try {

    // TODO: IMPLEMENT getActivities ENDPOINT
    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error fetching activities:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Fetches user activities with pagination and visibility.
 *
 * @param {Request} req - Request containing user ID, logged-in user ID, and pagination.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with activities or an error message.
 */
const getFriendsActivities = async (req, res) => {
  try {
    const { logged_user_id } = req.body;
    const { offset, limit } = req.query;

    // Fetch activities from friends
    const activities = await activitiesModel.selectFriendsActivity(logged_user_id, offset, limit);
    if (!activities) return res.status(404).json({ error: 'No activities found.' });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching friends activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getActivity = async (req, res) => {
  try {

    // TODO: IMPLEMENT getActivity ENDPOINT
    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error fetching activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteActivity = async (req, res) => {
  try {

    // TODO: IMPLEMENT deleteActivity ENDPOINT
    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error deleting activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const likeActivity = async (req, res) => {
  try {

    // TODO: IMPLEMENT likeActivity ENDPOINT
    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error posting like for activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const unlikeActivity = async (req, res) => {
  try {

    // TODO: IMPLEMENT unlikeActivity ENDPOINT
    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error posting unlike for activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getActivities,
  getFriendsActivities,
  getActivity,
  deleteActivity,
  likeActivity,
  unlikeActivity,
};
