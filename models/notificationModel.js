const { pool } = require('../config/database');

/**
 * Function to insert a notification for a user
 * @param {number} user_id - The ID of the user to send the notification to
 * @param {string} message - The message of the notification
 * @param {string} type - The type of the notification (e.g., 'info', 'alert')
 * @returns {Object} - An object with the inserted notification record
 * @throws {Error} - Throws an error if the insert operation fails
 */
const sendNotification = async (user_id, message, type) => {
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
};

const selectNotifications = async (user_id) => {
  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1;
  `;

  try {
    const result = await pool.query(query, [user_id]);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

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
};

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
};

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
};

module.exports = {
  sendNotification,
  selectNotifications,
  selectNotificationById,
  updateMarkAllAsRead,
  updateMarkAsReadById,
};
