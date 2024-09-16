const workoutModel = require('../models/workoutModel');
const userModel = require('../models/userModel');

// Fetch all workouts
const getWorkouts = async (req, res) => {
    const userId = req.query.user_id;
    const status = req.query.status?.match(/^(planned|in_progress|completed|skipped)$/i) ? req.query.status : null;

    try {
        // Check if parameter is valid and user exists
        if (userId) {
            if (isNaN(userId)) {
                return res.status(400).json({error: 'Invalid user ID'});
            }
            const user = userModel.getUser(userId);
            if (!user) {
                res.status(404).json({error: 'User not found'});
            }
        }

        const workouts = await workoutModel.getWorkouts(userId, status);

        if (workouts) {
            res.status(200).json(workouts);
        } else {
            res.status(404).json({error: 'Workouts not found'});
        }
    } catch (error) {
        console.error('Error getting workouts:', error.stack);
        res.status(500).json({error: 'Internal server error'});
    }
};

const postWorkout = async (req, res) => {
    // TODO: Implement POST /api/workouts

    res.status(501).json({error: 'Not implemented'});
};

const getWorkoutById = async (req, res) => {
    // TODO: Implement GET /api/workouts/{id}

    res.status(501).json({error: 'Not implemented'});
};

const patchWorkout = async (req, res) => {
    // TODO: Implement PATCH /api/workouts/{id}

    res.status(501).json({error: 'Not implemented'});
};

const deleteWorkout = async (req, res) => {
    // TODO: Implement DELETE /api/workouts/{id}

    res.status(501).json({error: 'Not implemented'});
};


module.exports = {
    getWorkouts,
    getWorkoutById,
    postWorkout,
    patchWorkout,
    deleteWorkout,
};
