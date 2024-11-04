const achievementModel = require('../models/achievementModel');

/**
 * Fetches user achievements.
 *
 * @param {Request} req - Request object.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with achievements or an error message.
 */
const fetchAchievements = async (req, res) => {
  try {
    // Fetch achievements from database
    const achievements = await achievementModel.selectAchievements();

    // Check if any achievements were returned
    if (!achievements) return res.status(404).json({ error: 'Achievements not found' });

    // Successful response with all achievements
    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Fetches a single achievement by its ID.
 *
 * @param {Request} req - Request object.
 * @param {Response} res - Response object for sending results.
 * @returns {void} - Responds with the achievement or an error message.
 */
const fetchAchievement = async (req, res) => {
  try {
    const { id: achievement_id } = req.params;

    // Fetch achievement from database
    const achievement = await achievementModel.selectAchievement(achievement_id);

    // Check if the achievement was found
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });

    // Successful response with the achievement
    res.status(200).json(achievement);
  } catch (error) {
    console.error('Error fetching achievement:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  fetchAchievements,
  fetchAchievement,
};
