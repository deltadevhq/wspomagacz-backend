const { pool } = require('../config/database');

/**
 * Function to get all friends of a specified user
 * @param {number} user_id - The ID of the user whose friends are being fetched
 * @returns {Array} - An array of friend records if found, or an empty array if no friends are found
 */
const fetchFriends = async (user_id) => {
  const query = `
    SELECT u.id, u.username, u.display_name, u.gender, u.birthday, u.status, u.level, u.exp, u.weights, u.height, f.modified_at AS friends_since
    FROM friends AS f
    JOIN users AS u ON (u.id = f.sender_id AND f.receiver_id = $1) OR (u.id = f.receiver_id AND f.sender_id = $1)
    WHERE f.status = 'accepted'
    ORDER BY f.modified_at DESC
  `;
  const values = [user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Function to fetch pending friend requests for a specified user
 * @param {number} user_id - The ID of the user receiving friend requests
 * @returns {Array|null} - An array of pending friend requests if found, or null if no requests are found
 */
const fetchFriendRequests = async (user_id) => {
  const query = `
    SELECT f.sender_id, u.username AS sender_username, f.receiver_id, f.status, f.requested_at
    FROM friends f
    JOIN users u ON f.sender_id = u.id
    WHERE f.receiver_id = $1 AND f.status = 'pending'
    ORDER BY f.requested_at DESC
  `;
  const values = [user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Function to send a friend request to a specified user
 * @param {number} sender_id - The ID of the user sending the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @returns {Object|null} - The newly created friend request object if successful, or null if no request was created
 */
const sendFriendRequest = async (sender_id, receiver_id) => {
  const query = `
    INSERT INTO friends (sender_id, receiver_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [sender_id, receiver_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Function to accept a friend request from a specified user
 * @param {number} sender_id - The ID of the user who sent the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @returns {Object|null} - The updated friend request object if successful, or null if no matching request was found
 */
const acceptFriendRequest = async (sender_id, receiver_id) => {
  const query = `UPDATE friends SET status = 'accepted', modified_at = NOW() WHERE status = 'pending' AND sender_id = $1 AND receiver_id = $2 RETURNING *`;
  const values = [sender_id, receiver_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Function to reject a friend request from a specified user
 * @param {number} sender_id - The ID of the user who sent the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @returns {Object|null} - The updated friend request object if successful, or null if no matching request was found
 */
const rejectFriendRequest = async (sender_id, receiver_id) => {
  const query = `UPDATE friends SET status = 'rejected', modified_at = NOW() WHERE status = 'pending' AND sender_id = $1 AND receiver_id = $2 RETURNING *`;
  const values = [sender_id, receiver_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Function to cancel a sent friend request between two users
 * @param {number} sender_id - The ID of the user who sent the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @returns {Object|null} - The canceled request object if successful, or null if no matching request was found
 */
const cancelFriendRequest = async (sender_id, receiver_id) => {
  const query = `
    DELETE FROM friends 
    WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending'
    RETURNING *
  `;
  const values = [sender_id, receiver_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Function to remove a friend relationship between two users
 * @param {number} user_id - The ID of the user initiating the removal
 * @param {number} removed_friend_id - The ID of the friend to be removed
 * @returns {Object|null} - The removed friend object if successful, or null if no matching relationship was found
 */
const removeFriend = async (user_id, removed_friend_id) => {
  const query = `
    DELETE FROM friends 
    WHERE (sender_id = $1 AND receiver_id = $2 AND status = 'accepted') 
       OR (sender_id = $2 AND receiver_id = $1 AND status = 'accepted')
    RETURNING *
  `;
  const values = [user_id, removed_friend_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Function to check for existence of pending friend requests
 * @param {number} sender_id - The ID of the user sending the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @returns {Array|null} - An array of existing pending friend requests if found, or null if no duplicates are found
 */
const checkFriendRequestExists = async (sender_id, receiver_id, status = 'pending') => {
  const query = `
    SELECT * FROM friends 
    WHERE (sender_id = $1 AND receiver_id = $2 OR sender_id = $2 AND receiver_id = $1)
    AND status = $3
  `;
  const values = [sender_id, receiver_id, status];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      // Check who sent the request
      const isSender = result.rows[0].sender_id === sender_id;
      return { direction: isSender ? 'sent' : 'received' };
    }
    return null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Fetches user activity from friends based on visibility and pagination options
 * @param {number} user_id - The ID of the user viewing activities
 * @param {string} visibility - Determines whether to show private or public activities ('private' or 'public')
 * @param {number} offset - The number of items to skip for pagination
 * @param {number} limit - The maximum number of items to return
 * @returns {Array|null} - An array of friend activities with like counts, or null if none found
 */
const selectFriendsActivity = async (user_id, offset = 0, limit = 10) => {
  const query = `
    SELECT ua.*, COUNT(ual.activity_id) AS likes
    FROM user_activities ua
    LEFT JOIN user_activity_likes ual ON ual.activity_id = ua.id
    WHERE ua.user_id IN (
      SELECT CASE 
        WHEN sender_id = $1 THEN receiver_id
        ELSE sender_id 
      END 
      FROM friends 
      WHERE (sender_id = $1 OR receiver_id = $1) AND status = 'accepted'
    ) 
    AND ua.hidden = false
    GROUP BY ua.id, ua.created_at 
    ORDER BY ua.created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const values = [user_id, limit, offset];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  fetchFriends,
  fetchFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  checkFriendRequestExists,
  selectFriendsActivity,
};
