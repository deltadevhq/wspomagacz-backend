const { pool } = require('../config/database');

/**
 * Selects notifications for a specified user with pagination.
 *
 * @param {number} user_id - The ID of the user whose notifications are to be fetched.
 * @param {number} [offset=0] - The number of records to skip (for pagination).
 * @param {number} [limit=10] - The maximum number of records to return (for pagination).
 * @returns {Array|null} - An array of notifications or null if none found.
 */
const selectNotifications = async (user_id, offset = 0, limit = 10) => {
  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const values = [user_id, limit, offset];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Retrieves a specific notification by its ID.
 *
 * @param {number} id - The ID of the notification to retrieve.
 * @returns {Object|null} - The notification object if found, or null if no notification exists with the provided ID.
 */
const selectNotificationById = async (notification_id) => {
  const query = `
    SELECT *
    FROM notifications
    WHERE id = $1;
  `;
  const values = [notification_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Function to insert a notification for a user
 * 
 * @param {number} user_id - The ID of the user to send the notification to
 * @param {string} message - The message of the notification
 * @param {string} type - The type of the notification (e.g., 'info', 'alert')
 * @returns {Object} - An object with the inserted notification record
 */
const insertNotification = async (user_id, message, type) => {
  const query = `
    INSERT INTO notifications (user_id, message, type)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [user_id, message, type];

  try {
    const result = await pool.query(query, values);

    // Check if the insert was successful
    if (result.rows.length === 0) {
      throw new Error(`Notification insert failed for user_id: ${user_id}. No rows returned.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error inserting notification for user_id: ${user_id}`, error.stack);
    throw new Error('Database insert failed while recording the notification.');
  }
}

/**
 * Marks all notifications for a user as read.
 *
 * @param {number} user_id - The ID of the user whose notifications will be marked as read.
 * @returns {Array|null} - An array of the updated notification records if successful, or null if no notifications were found.
 */
const updateMarkAllAsRead = async (user_id) => {
  const query = `
    UPDATE notifications
    SET read = true
    WHERE user_id = $1
    RETURNING *;
  `;
  const values = [user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Marks a specific notification as read by its ID.
 *
 * @param {number} id - The ID of the notification to mark as read.
 * @returns {Object|null} - The updated notification record if successful, or null if no notification was found.
 */
const updateMarkAsReadById = async (notification_id) => {
  const query = `
    UPDATE notifications
    SET read = true
    WHERE id = $1
    RETURNING *;
  `;
  const values = [notification_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

module.exports = {
  selectNotifications,
  selectNotificationById,
  insertNotification,
  updateMarkAllAsRead,
  updateMarkAsReadById,
}