const { pool } = require('../config/database');

/**
 * Selects a single user from the database by their ID.
 *
 * @param {number} user_id - The ID of the user to search for.
 * @returns {Object|null} - The user object if found, or null if no user matches the ID.
 */
const selectUserById = async (user_id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
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
 * Selects a single user from the database by their username.
 *
 * @param {string} username - The username of the user to search for.
 * @returns {Object|null} - The user object if found, or null if no user matches the username.
 */
const selectUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Selects a single user from the database by their email.
 *
 * @param {string} email - The email address of the user to search for.
 * @returns {Object|null} - The user object if found, or null if no user matches the email.
 */
const selectUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Inserts a new user into the database.
 *
 * @param {string} username - The username of the user.
 * @param {string} password_hash - The hashed password of the user.
 * @param {string} email - The email address of the user.
 * @returns {Object} - The newly created user object.
 */
const insertUser = async (username, password_hash, email) => {
  const query = `
    INSERT INTO users (username, display_name, password_hash, email)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [username, username, password_hash, email]; 

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error executing query:', error.stack);
    throw error;
  }
}

/**
 * Updates the user's password in the database.
 *
 * @param {number} user_id - The ID of the user whose password is to be updated.
 * @param {string} password_hash - The new hashed password.
 * @returns {Object|null} - The updated user object if successful, or throws an error if the user is not found.
 */
const updateUserPassword = async (user_id, password_hash) => {
  const query = `UPDATE users SET password_hash = $2 WHERE id = $1 RETURNING *`;
  const values = [user_id, password_hash];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Updates the last_logged_at column in the database upon user login.
 *
 * @param {string} username - The username of the user whose login time is to be updated.
 * @returns {Object|null} - The updated user object if successful, or null if no user was found.
 */
const updateUserLastLogin = async (username) => {
  const query = 'UPDATE users SET last_logged_at = NOW() WHERE username = $1';
  const values = [username];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Updates user information in the database by their ID.
 *
 * @param {number} user_id - The ID of the user to update.
 * @param {string|null} display_name - The new display name of the user (optional).
 * @param {string|null} gender - The new gender of the user (optional).
 * @param {Date|null} birthday - The new birthday of the user (optional).
 * @param {number|null} weights - The new weights of the user (optional).
 * @param {number|null} height - The new height of the user (optional).
 * @returns {Object|null} - The updated user object if successful, or null if no user was found.
 */
const updateUser = async (user_id, display_name, gender, birthday, weights, height) => {
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
}

/**
 * Deletes a user from the database by their ID.
 *
 * @param {number} user_id - The ID of the user to delete.
 * @returns {Object|null} - The deleted user object if successful, or null if no user was found.
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
}

module.exports = {
  selectUserById,
  selectUserByUsername,
  selectUserByEmail,
  insertUser,
  updateUser,
  updateUserPassword,
  updateUserLastLogin,
  deleteUser,
}