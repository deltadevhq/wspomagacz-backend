const { pool } = require('../config/database');

/**
 * Select single user from database by its username
 */
const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Select single user from database by its email 
 */
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Insert user to database
 */
const postUser = async (username, password_hash, email) => {
  const query = `
    INSERT INTO users (username, display_name, password_hash, email)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  // display_name is username by default
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
 * Update last_logged_at column in database on user login
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
};

module.exports = {
  getUserByUsername,
  getUserByEmail,
  postUser,
  updateUserLastLogin
};