const activitiesModel = require('../models/activitiesModel');

/**
 * Fetches user activities with pagination and visibility.
 *
 * @param {Request} req - Request containing user ID, logged-in user ID, and pagination.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with activities or an error message.
 */
const fetchActivities = async (req, res) => {
  try {
    const { logged_user_id } = req.body;
    const { user_id: request_user_id, offset, limit } = req.query;
    let visibility = 'public';

    const user_id = request_user_id || logged_user_id;
    if (logged_user_id === Number(user_id)) visibility = 'private';

    const activities = await activitiesModel.selectUserActivities(user_id, visibility, offset, limit);
    if (!activities) return res.status(404).json({ error: 'Activities not found.' });

    res.status(200).json(activities);

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
const fetchFriendsActivities = async (req, res) => {
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

const fetchActivity = async (req, res) => {
  try {

    // TODO: IMPLEMENT getActivity ENDPOINT
    res.status(501).json({ error: 'Not implemented' });

  } catch (error) {
    console.error('Error fetching activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteActivity = async (req, res) => {
  try {

    // TODO: IMPLEMENT deleteActivity ENDPOINT
    res.status(501).json({ error: 'Not implemented' });

  } catch (error) {
    console.error('Error deleting activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const likeActivity = async (req, res) => {
  try {

    // TODO: IMPLEMENT likeActivity ENDPOINT
    res.status(501).json({ error: 'Not implemented' });

  } catch (error) {
    console.error('Error posting like for activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const unlikeActivity = async (req, res) => {
  try {

    // TODO: IMPLEMENT unlikeActivity ENDPOINT
    res.status(501).json({ error: 'Not implemented' });

  } catch (error) {
    console.error('Error posting unlike for activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  fetchActivities,
  fetchFriendsActivities,
  fetchActivity,
  deleteActivity,
  likeActivity,
  unlikeActivity,
};
