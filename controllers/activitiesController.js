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

    const activities = await activitiesModel.selectActivities(user_id, visibility, offset, limit);
    if (!activities) return res.status(404).json({ error: 'Activities not found.' });

    res.status(200).json(activities);

  } catch (error) {
    console.error('Error fetching activities:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Fetches activities from friends with pagination.
 *
 * @param {Request} req - Request containing logged-in user ID and pagination.
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

/**
 * Fetches a single activity by its ID.
 *
 * @param {Request} req - Request containing logged-in user ID and activity ID.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with the activity or an error message.
 */
const fetchActivity = async (req, res) => {
  try {
    const { logged_user_id } = req.body;
    const { id: activity_id } = req.params;

    // Fetch the activity by ID
    const activity = await activitiesModel.selectActivity(activity_id);
    if (!activity) return res.status(404).json({ error: 'Activity not found.' });

    // Check if the user has permissions to view the activity
    if (activity.hidden === true && activity.user_id !== logged_user_id) return res.status(403).json({ error: 'Insufficient permissions to view this activity.' });

    res.status(200).json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Deletes a single activity by its ID.
 *
 * @param {Request} req - Request containing logged-in user ID and activity ID.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with a success message or an error message.
 */
const deleteActivity = async (req, res) => {
  try {
    const { logged_user_id } = req.body;
    const { id: activity_id } = req.params;

    // Fetch the activity to ensure it exists and belongs to the user
    const activity = await activitiesModel.selectActivity(activity_id);
    if (!activity) return res.status(404).json({ error: 'Activity not found.' });

    // Check if the logged-in user is the owner of the activity
    if (activity.user_id !== logged_user_id) return res.status(403).json({ error: 'Insufficient permissions to delete this activity.' });

    // Delete the activity
    const deletedActivity = await activitiesModel.deleteActivity(activity_id);
    if (!deletedActivity) return res.status(500).json({ error: 'Failed to delete the activity.' });

    res.status(200).json({ message: 'Activity deleted successfully.' });
  } catch (error) {
    console.error('Error deleting activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Likes a single activity by its ID.
 *
 * @param {Request} req - Request containing logged-in user ID and activity ID.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with a success message or an error message.
 */
const likeActivity = async (req, res) => {
  try {
    const { logged_user_id } = req.body;
    const { id: activity_id } = req.params;

    // Check if the activity exists
    const activity = await activitiesModel.selectActivity(activity_id);
    if (!activity) return res.status(404).json({ error: 'Activity not found.' });

    // Check if the user has already liked the activity
    const existingLike = await activitiesModel.selectActivityLike(activity_id, logged_user_id);
    if (existingLike) return res.status(409).json({ error: 'You have already liked this activity.' });

    // Add a like to the activity
    await activitiesModel.insertLike(activity_id, logged_user_id);

    const updatedActivity = await activitiesModel.selectActivity(activity_id);
    const likeCount = updatedActivity.likes;

    res.status(200).json({ likes: likeCount });
  } catch (error) {
    console.error('Error posting like for activity:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Unlikes a single activity by its ID.
 *
 * @param {Request} req - Request containing logged-in user ID and activity ID.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with a success message or an error message.
 */
const unlikeActivity = async (req, res) => {
  try {
    const { logged_user_id } = req.body;
    const { id: activity_id } = req.params;

    // Check if the activity exists
    const activity = await activitiesModel.selectActivity(activity_id);
    if (!activity) return res.status(404).json({ error: 'Activity not found.' });

    // Check if the user has liked the activity
    const existingLike = await activitiesModel.selectActivityLike(activity_id, logged_user_id);
    if (!existingLike) return res.status(404).json({ error: 'You have not liked this activity.' });

    // Remove the like from the activity
    await activitiesModel.deleteLike(activity_id, logged_user_id);

    const updatedActivity = await activitiesModel.selectActivity(activity_id);
    const likeCount = updatedActivity.likes;

    res.status(200).json({ likes: likeCount });
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
