const { pool } = require('../config/database');

/**
 * Fetches a single activity with like count by its ID
 * 
 * @param {number} activity_id - ID of the activity to fetch
 * @param {number} logged_user_id - The ID of the user viewing activities
 * @returns {Object|null} - Activity with like count, or null if not found
 */
const selectActivity = async (activity_id, logged_user_id) => {
  const query = `
    SELECT ua.*,
      JSON_BUILD_OBJECT('id', u.id, 'display_name', u.display_name) AS "user",
      JSON_BUILD_OBJECT('id', creator.id, 'display_name', creator.display_name) AS creator,
      COUNT(ual.activity_id) AS likes,
      CASE WHEN ual.user_id = $2 THEN true ELSE false END AS liked
    FROM user_activities ua
      JOIN users u ON ua.user_id = u.id
      JOIN users creator ON ua.created_by = creator.id
      LEFT JOIN user_activity_likes ual ON ual.activity_id = ua.id
    WHERE ua.id = $1
    GROUP BY ua.id, u.id, creator.id, ual.user_id
  `;
  const values = [activity_id, logged_user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Fetches user activities with like counts, ordered by creation date
 * 
 * @param {number} user_id - ID of the user whose activities to fetch
 * @param {string} visibility - 'private' or 'public' to filter visibility
 * @param {number} logged_user_id - The ID of the user viewing activities
 * @param {number} offset - Number of items to skip for pagination
 * @param {number} limit - Max number of items to return
 * @returns {Array|null} - Array of activities with like counts, ordered by most recent, or null if none found
 */
const selectActivities = async (user_id, visibility, logged_user_id, offset = 0, limit = 10) => {
  const query = `
    SELECT ua.*,
      JSON_BUILD_OBJECT('id', u.id, 'display_name', u.display_name) AS "user",
      JSON_BUILD_OBJECT('id', creator.id, 'display_name', creator.display_name) AS creator,
      COUNT(ual.activity_id) AS likes,
      CASE WHEN ual.user_id = $3 THEN true ELSE false END AS liked
    FROM user_activities ua
      JOIN users u ON ua.user_id = u.id
      JOIN users creator ON ua.created_by = creator.id
      LEFT JOIN user_activity_likes ual ON ual.activity_id = ua.id
    WHERE ua.user_id = $1 
      AND (CASE WHEN $2 = FALSE THEN ua.hidden = $2 ELSE TRUE END)
    GROUP BY ua.id, ua.created_at, u.id, creator.id, ual.user_id
    ORDER BY ua.created_at DESC
    LIMIT $4 OFFSET $5;
  `;
  const hidden = visibility === 'private';
  const values = [user_id, hidden, logged_user_id, limit, offset];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Fetches user activity from friends based on pagination options
 * 
 * @param {number} logged_user_id - The ID of the user viewing activities
 * @param {number} offset - The number of items to skip for pagination
 * @param {number} limit - The maximum number of items to return
 * @returns {Array|null} - An array of friend activities with like counts, or null if none found
 */
const selectFriendsActivity = async (logged_user_id, offset = 0, limit = 10) => {
  const query = `
      SELECT ua.*,
        JSON_BUILD_OBJECT('id', u.id, 'display_name', u.display_name) AS "user",
        JSON_BUILD_OBJECT('id', creator.id, 'display_name', creator.display_name) AS creator,
        COUNT(ual.activity_id) AS likes,
        CASE WHEN ual.user_id = $1 THEN true ELSE false END AS liked
      FROM user_activities ua
        JOIN users u ON ua.user_id = u.id
        JOIN users creator ON ua.created_by = creator.id
        LEFT JOIN user_activity_likes ual ON ual.activity_id = ua.id
      WHERE ua.user_id IN (
        SELECT CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END
        FROM friends WHERE (sender_id = $1 OR receiver_id = $1) AND status = 'accepted'
      )
        AND ua.hidden = false
      GROUP BY ua.id, ua.created_at, u.id, creator.id, ual.user_id
      ORDER BY ua.created_at DESC
      LIMIT $2 OFFSET $3;
  `;
  const values = [logged_user_id, limit, offset];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Checks if a user has liked a specific activity.
 *
 * @param {number} activity_id - ID of the activity to check.
 * @param {number} user_id - ID of the user to check for a like.
 * @returns {Object|null} - Like object if found, or null if not found.
 */
const selectActivityLike = async (activity_id, user_id) => {
  const query = `
    SELECT *
    FROM user_activity_likes
    WHERE activity_id = $1 AND user_id = $2
  `;
  const values = [activity_id, user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Inserts a new user activity into the database.
 *
 * @param {number} user_id - The ID of the user for whom the activity is being recorded.
 * @param {string} type - Type of the activity.
 * @param {Object} data - Additional data related to the activity.
 * @param {number} [created_by=1] - The ID of the creator of the activity, defaults to 1.
 * @param {string} visibility - The visibility of the activity ('private' or 'public').
 * @returns {Object|null} - The inserted user activity object if successful, or null if not.
 */
const insertActivity = async (user_id, type, data, created_by = 1, visibility) => {
  const query = `
    INSERT INTO user_activities (
      user_id,
      type,
      data,
      created_by,
      hidden
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const hidden = visibility === 'private';
  const values = [user_id, type, data, created_by, hidden];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Inserts a like for a specific activity by a user.
 *
 * @param {number} activity_id - ID of the activity to like.
 * @param {number} user_id - ID of the user liking the activity.
 * @returns {Object} - The newly created like object.
 */
const insertLike = async (activity_id, user_id) => {
  const query = `
    INSERT INTO user_activity_likes (activity_id, user_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [activity_id, user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Deletes a single activity by its ID.
 * 
 * @param {number} activity_id - ID of the activity to delete.
 * @returns {Object|null} - Deleted activity object if successful, or null if not found.
 */
const deleteActivity = async (activity_id) => {
  const query = `
    DELETE FROM user_activities
    WHERE id = $1
    RETURNING *
  `;
  const values = [activity_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Deletes a like for a specific activity by a user.
 *
 * @param {number} activity_id - ID of the activity to unlike.
 * @param {number} user_id - ID of the user unliking the activity.
 * @returns {Object|null} - The deleted like object if successful, or null if not found.
 */
const deleteLike = async (activity_id, user_id) => {
  const query = `
    DELETE FROM user_activity_likes
    WHERE activity_id = $1 AND user_id = $2
    RETURNING *
  `;
  const values = [activity_id, user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Changes the visibility of a specific activity for a user by setting the hidden status.
 *
 * @param {number} activity_id - ID of the activity to change visibility for.
 * @param {number} user_id - ID of the user changing the visibility.
 * @param {string} visibility - The visibility status ('private' to hide, 'public' to show).
 * @returns {Object|null} - The updated activity object if successful, or null if not found.
 */
const updateUserActivityVisibility = async (activity_id, logged_user_id, visibility) => {
  const query = `
    UPDATE user_activities 
    SET hidden = $3 
    WHERE id = $1
    AND user_id =  $2
    RETURNING *
  `;
  const hidden = (visibility === 'private');
  const values = [activity_id, logged_user_id, hidden];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

module.exports = {
  selectActivity,
  selectActivities,
  selectFriendsActivity,
  selectActivityLike,
  insertActivity,
  insertLike,
  deleteActivity,
  deleteLike,
  updateUserActivityVisibility,
}