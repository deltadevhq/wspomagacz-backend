const pool = require('../config/database');

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

module.exports = {
  getUserById,
  patchUser,
  deleteUser
};