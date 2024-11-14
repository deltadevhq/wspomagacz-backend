const { pool } = require('../config/database');

/**
 * Function to get all friends of a specified user
 * 
 * @param {number} user_id - The ID of the user whose friends are being fetched
 * @returns {Array} - An array of friend records if found, or an empty array if no friends are found
 */
const selectFriends = async (user_id) => {
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
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Function to fetch pending friend requests for a specified user
 * 
 * @param {number} user_id - The ID of the user receiving friend requests
 * @returns {Array|null} - An array of pending friend requests if found, or null if no requests are found
 */
const selectFriendRequests = async (user_id) => {
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
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Function to fetch the experience leaderboard data for friends of a specified user
 * 
 * @param {number} user_id - The ID of the user whose friends leaderboard data is being retrieved
 * @returns {Array} - An array of leaderboard entries for friends, or an empty array if no entries are found
 */
const selectFriendsExperienceLeaderboard = async (user_id) => {
  const query = `
    SELECT mle.*
    FROM monthly_leaderboard_exp mle 
    JOIN friends f ON f.sender_id = mle.user_id OR f.receiver_id = mle.user_id 
    WHERE (f.sender_id = $1 OR f.receiver_id = $1) 
    AND f.status = 'accepted'
  `;
  const values = [user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Function to fetch the weight leaderboard data for friends of a specified user
 * 
 * @param {number} user_id - The ID of the user whose friends leaderboard data is being retrieved
 * @returns {Array} - An array of leaderboard entries for friends, or an empty array if no entries are found
 */
const selectFriendsWeightLeaderboard = async (user_id) => {
  const query = `
    SELECT mlw.*
    FROM monthly_leaderboard_weight mlw
    JOIN friends f ON f.sender_id = mlw.user_id OR f.receiver_id = mlw.user_id 
    WHERE (f.sender_id = $1 OR f.receiver_id = $1) 
    AND f.status = 'accepted'
  `;
  const values = [user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Function to send a friend request to a specified user
 * 
 * @param {number} sender_id - The ID of the user sending the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @returns {Object|null} - The newly created friend request object if successful, or null if no request was created
 */
const insertFriendRequest = async (sender_id, receiver_id) => {
  const query = `
    INSERT INTO friends (sender_id, receiver_id)
    VALUES ($1, $2)
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
}

/**
 * Function to accept a friend request from a specified user
 * 
 * @param {number} sender_id - The ID of the user who sent the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @returns {Object|null} - The updated friend request object if successful, or null if no matching request was found
 */
const updateFriendRequestWithAcceptance = async (sender_id, receiver_id) => {
  const query = `
    UPDATE friends 
    SET status = 'accepted', modified_at = NOW() 
    WHERE status = 'pending' AND sender_id = $1 AND receiver_id = $2 
    RETURNING *, (SELECT jsonb_build_object('id', id, 'display_name', display_name) FROM users WHERE id = $1) AS sender, (SELECT jsonb_build_object('id', id, 'display_name', display_name) FROM users WHERE id = $2) AS receiver
  `;
  const values = [sender_id, receiver_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Function to reject a friend request from a specified user
 * 
 * @param {number} sender_id - The ID of the user who sent the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @returns {Object|null} - The updated friend request object if successful, or null if no matching request was found
 */
const updateFriendRequestWithRejection = async (sender_id, receiver_id) => {
  const query = `UPDATE friends SET status = 'rejected', modified_at = NOW() WHERE status = 'pending' AND sender_id = $1 AND receiver_id = $2 RETURNING *`;
  const values = [sender_id, receiver_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Function to cancel a sent friend request between two users
 * 
 * @param {number} sender_id - The ID of the user who sent the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @returns {Object|null} - The canceled request object if successful, or null if no matching request was found
 */
const deleteFriendRequest = async (sender_id, receiver_id) => {
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
}

/**
 * Function to remove a friend relationship between two users
 * 
 * @param {number} user_id - The ID of the user initiating the removal
 * @param {number} removed_friend_id - The ID of the friend to be removed
 * @returns {Object|null} - The removed friend object if successful, or null if no matching relationship was found
 */
const deleteFriend = async (user_id, removed_friend_id) => {
  const query = `
    DELETE FROM friends 
    WHERE (sender_id = $1 AND receiver_id = $2 AND status = 'accepted') 
       OR (sender_id = $2 AND receiver_id = $1 AND status = 'accepted')
    RETURNING *
  `;
  const values = [user_id, removed_friend_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Function to check for existence of pending friend requests
 * 
 * @param {number} sender_id - The ID of the user sending the friend request
 * @param {number} receiver_id - The ID of the user receiving the friend request
 * @param {'pending'|'rejected'|'accepted'} status - The status of the friend request
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
}

module.exports = {
  selectFriends,
  selectFriendRequests,
  selectFriendsExperienceLeaderboard,
  selectFriendsWeightLeaderboard,
  insertFriendRequest,
  updateFriendRequestWithAcceptance,
  updateFriendRequestWithRejection,
  deleteFriendRequest,
  deleteFriend,
  checkFriendRequestExists,
}