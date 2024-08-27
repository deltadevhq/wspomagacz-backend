const pool = require('../config/database');

// Fetch single users
const getUser = async (userId) => {
  try {
    const query = 'SELECT id, username, display_name, gender, birthday, status, level, exp, weights, height, created_at FROM users WHERE id = $1';
    const values = [userId];

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Create new user with only necessary data
const postUser = async (username, displayName, passwordHash, email) => {
  const query = `
  INSERT INTO users (username, display_name, password_hash, email)
  VALUES ($1, $2, $3, $4)
  RETURNING id, username, email;`

  const values = [username, displayName, passwordHash, email];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error.stack);
    throw error;
  }
}

// Function to find a user by email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error finding user by email:', error.stack);
    throw error;
  }
};

// Function to find a user by username
const findUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error finding user by username:', error.stack);
    throw error;
  }
};


module.exports = {
  getUser,
  postUser,
  findUserByEmail,
  findUserByUsername
};