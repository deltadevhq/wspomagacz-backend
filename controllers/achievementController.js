const achievementModel = require('../models/achievementModel');

const fetchAchievements = async (req, res) => {
  try {
    // Fetch achievements from database
    const achievements = await achievementModel.selectAchievements();

    // Check if anything was returned
    if (!achievements) return res.status(404).json({ error: 'Achievements not found' });

    // Successful response with all achievements
    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  fetchAchievements,
};
