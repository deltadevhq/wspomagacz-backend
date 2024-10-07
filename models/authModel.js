const pool = require('../config/database');

// Get single user by its username
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

// Get single user by its email
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

// Create new user
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

// Update last_logged_at column on user login
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