const experienceModel = require('../models/experienceModel');
const experienceSchema = require('../schemas/experienceSchema');


/**
 * Returns what level is granted by given XP
 */
const getLevelByXp = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * Returns how much XP is needed for given level
 */
const getXpByLevel = async (req, res) => {
  // Validate input data
  const { error } = experienceSchema.getXpByLevelSchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message })

  try {
    // Calculate experience needed for certain level
    const xp = await experienceModel.getXpByLevel(Number(req.query.level));

    // Successful response with level and required xp
    res.status(200).json({level: Number(req.query.level), xp});
  } catch (error) {
    console.error('Error getting experience by level:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getLevelByXp,
  getXpByLevel,
};
