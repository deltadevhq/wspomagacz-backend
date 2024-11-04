const { pool } = require('../config/database');

/**
 * Retrieves notifications for a specific user.
 *
 * @param {number} user_id - The ID of the user to retrieve notifications for.
 * @returns {Array|null} - An array of notification objects if found, or null if no notifications exist for the user.
 */
const selectNotifications = async (user_id) => {
  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  try {
    const result = await pool.query(query, [user_id]);
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
const selectNotificationById = async (id) => {
  const query = `
    SELECT *
    FROM notifications
    WHERE id = $1;
  `;

  try {
    const result = await pool.query(query, [id]);
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

  try {
    const result = await pool.query(query, [user_id]);
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
const updateMarkAsReadById = async (id) => {
  const query = `
    UPDATE notifications
    SET read = true
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [id]);
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