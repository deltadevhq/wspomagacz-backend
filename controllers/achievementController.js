// const achievementModel = require('../models/achievementModel');

const getAchievements = async (req, res) => {
  try {

    // TODO: IMPLEMENT getAchievements ENDPOINT
    res.status(501).json({error: 'Not implemented'});

  } catch (error) {
    console.error('Error fetching achievements:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAchievements,
};
