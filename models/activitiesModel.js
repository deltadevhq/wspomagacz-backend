const { pool } = require('../config/database');

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
  selectFriendsActivity,
};
