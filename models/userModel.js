const pool = require('../config/database');

// Fetch single users
const getUser = async (userId) => {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [userId];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Patch user data
const patchUser = async (userId, displayName, gender, birthday, weights, height) => {
  try {
    const query = `
        UPDATE users
        SET 
            display_name = COALESCE($1, display_name),
            gender = COALESCE($2, gender),
            birthday = COALESCE($3, birthday),
            weights = COALESCE($4, weights),
            height = COALESCE($5, height)
        WHERE id = $6
        RETURNING *;
    `;
    const values = [displayName, gender, birthday, weights, height, userId];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Fetch user custom exercises
const getUserExercises = async (userId) => {
  try {
    const query = 'SELECT * FROM custom_exercises WHERE user_id =  $1';
    const values = [userId];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  getUser,
  patchUser,
  getUserExercises
};