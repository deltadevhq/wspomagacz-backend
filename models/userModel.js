const { pool } = require('../config/database');

/**
 * Select single user from database by its ID
 */
const getUserById = async (user_id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Update user in database by its ID
 */
const patchUser = async (user_id, display_name, gender, birthday, weights, height) => {
  const query = `
    UPDATE users
    SET 
        display_name = COALESCE($1, display_name),
        gender = COALESCE($2, gender),
        birthday = COALESCE($3, birthday),
        weights = COALESCE($4, weights),
        height = COALESCE($5, height)
    WHERE id = $6
    RETURNING *
  `;
  const values = [display_name, gender, birthday, weights, height, user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Delete user from database by its ID
 */
const deleteUser = async (user_id) => {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
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
 * Fetches user activities with like counts, ordered by creation date.
 * @param {number} user_id - ID of the user whose activities to fetch.
 * @param {string} visibility - 'private' or 'public' to filter visibility.
 * @param {number} offset - Number of items to skip for pagination.
 * @param {number} limit - Max number of items to return.
 * @returns {Array|null} - Array of activities with like counts, ordered by most recent, or null if none found.
 */
const selectUserActivities = async (user_id, visibility, offset = 0, limit = 10) => {
  const query = `
    SELECT ua.*, COUNT(ual.activity_id) AS likes
    FROM user_activity ua
      LEFT JOIN user_activity_likes ual ON ual.activity_id = ua.id
    WHERE ua.user_id = $1 AND ua.hidden = COALESCE($2, ua.hidden)
    GROUP BY ua.id, ua.created_at 
    ORDER BY ua.created_at DESC
    LIMIT $3 OFFSET $4;
  `;
  const hidden = visibility === 'private';
  const values = [user_id, hidden, limit, offset];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

const insertUserActivity = async (user_id, message, data, created_by = 1) => {
  // TODO: INSERT ACTIVITIES
  const query = `
    INSERT INTO user_activity (
      user_id,
      message,
      data,
      created_by
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [user_id, message, data, created_by];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

module.exports = {
  getUserById,
  patchUser,
  deleteUser,
  selectUserActivities,
  insertUserActivity,
};