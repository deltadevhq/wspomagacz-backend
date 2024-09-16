const pool = require('../config/database');

// Fetch all workouts
const getWorkouts = async (userId, status) => {
    try {
        const query = 'SELECT * FROM workouts WHERE user_id = COALESCE($1, user_id) AND status = COALESCE($2, status)';

        if (status === 'all') status = null;
        const values = [userId, status];

        const result = await pool.query(query, values);
        return result.rows.length > 0 ? result.rows : null;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    }
};

const getWorkoutById = async (userId, status) => {
    throw new Error('Not implemented');
};


module.exports = {
    getWorkouts,
    getWorkoutById
};
