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
};

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
};

/**
 * Retrieves a list of users whose usernames match the specified pattern, with optional pagination.
 *
 * @param {string} username - The pattern to match usernames against (case-insensitive).
 * @param {number} [offset=0] - The number of records to skip (for pagination).
 * @param {number} [limit=10] - The maximum number of records to return (for pagination).
 * @returns {Array} - An array of user objects that match the criteria, or an empty array if no matches are found.
 */
const selectUsersByUsername = async (username, offset = 0, limit = 10) => {
  const query = `
    SELECT *
    FROM users
    WHERE username ILIKE '%' || $1 || '%'
    ORDER BY username
    LIMIT $2 OFFSET $3
  `;
  const values = [username, limit, offset];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

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
};

/**
 * Retrieves all achievements for a specified user by user ID.
 *
 * @param {number} user_id - The ID of the user whose achievements are to be fetched.
 * @returns {Array|null} - An array of user achievements or null if none are found.
 */
const selectUserAchievements = async (user_id) => {
  const query = `
    SELECT ua.*,
           ae.exercise_id,
           json_build_object(
             'id', a.id,
             'description', a.description,
             'target_value', a.target_value,
             'min_value', a.min_value,
             'tier', a.tier,
             'xp', a.xp,
             'type', a.type
           ) AS achievement
    FROM user_achievements ua
           LEFT JOIN achievements a ON ua.achievement_id = a.id
           LEFT JOIN achievement_exercises ae ON ae.achievement_id = a.id
    WHERE user_id = $1
  `;
  const values = [user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Retrieves a specific achievement for a user by user ID and achievement ID.
 *
 * @param {number} user_id - The ID of the user whose achievement is to be fetched.
 * @param {number} achievement_id - The ID of the achievement to retrieve.
 * @returns {Object|null} - The user's achievement object or null if not found.
 */
const selectUserAchievementById = async (user_id, achievement_id) => {
  const query = `
    SELECT *
    FROM user_achievements
    WHERE user_id = $1
      AND achievement_id = $2
  `;
  const values = [user_id, achievement_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Retrieves exercise statistics for a specific user and exercise.
 *
 * @param {number} user_id - The ID of the user whose exercise statistics are being retrieved.
 * @param {number} exercise_id - The ID of the exercise whose statistics are being retrieved.
 * @returns {Object|null} - The exercise statistics object if found, or null if not found.
 */
const selectUserExerciseStats = async (user_id, exercise_id) => {
  const query = `
    SELECT *
    FROM user_workout_exercise_stats
    WHERE user_id = $1
      AND exercise_id = $2
  `;
  const values = [user_id, exercise_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Select user's avatar from the database.
 *
 * @param {number} user_id - The ID of the user whose avatar is to be fetched.
 * @returns {Object|null} - The user avatar if found, or null if not.
 */
const selectUserAvatarById = async (user_id) => {
  const query = `
    SELECT avatar
    FROM user_avatars
    WHERE user_id = $1
  `;
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
};

/**
 * Updates the user's password in the database.
 *
 * @param {number} user_id - The ID of the user whose password is to be updated.
 * @param {string} password_hash - The new hashed password.
 * @returns {Object|null} - The updated user object if successful, or throws an error if the user is not found.
 */
const updateUserPassword = async (user_id, password_hash) => {
  const query = `UPDATE users
                 SET password_hash = $2
                 WHERE id = $1
                 RETURNING *`;
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
};

/**
 * Updates the user's avatar in the database.
 *
 * @param {number} user_id - The ID of the user whose avatar is to be updated.
 * @param {Buffer} avatar - The new avatar data as a Buffer.
 * @returns {Object|null} - The updated avatar object if successful, or throws an error if the user is not found.
 */
const updateUserAvatar = async (user_id, avatar) => {
  const query = `
    INSERT INTO user_avatars (user_id, avatar)
    VALUES ($1, $2)
    ON CONFLICT (user_id)
      DO UPDATE SET avatar = EXCLUDED.avatar
    RETURNING *`;
  const values = [user_id, avatar];

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
};

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
};

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
    SET display_name = COALESCE($1, display_name),
        gender       = COALESCE($2, gender),
        birthday     = COALESCE($3, birthday),
        weights      = COALESCE($4, weights),
        height       = COALESCE($5, height)
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
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  selectUserById,
  selectUserByUsername,
  selectUsersByUsername,
  selectUserByEmail,
  selectUserAchievements,
  selectUserAchievementById,
  selectUserExerciseStats,
  selectUserAvatarById,
  insertUser,
  updateUser,
  updateUserPassword,
  updateUserAvatar,
  updateUserLastLogin,
  deleteUser,
};
