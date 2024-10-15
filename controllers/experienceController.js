const experienceModel = require('../models/experienceModel');
const experienceSchema = require('../schemas/experienceSchema');


/**
 * Returns what level is granted by given XP
 */
const getLevelByXp = async (req, res) => {
  // Validate input data
  const { error } = experienceSchema.getLevelByXpSchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message })

  try {
    // Convert XP to a number
    const xp = Number(req.query.xp);

    // Calculate the user's current level based on the provided XP
    const level = await experienceModel.getLevelByXp(xp);

    // Calculate XP required for the current and next levels
    const current_level_xp = await experienceModel.getXpByLevel(level);
    const next_level_xp = await experienceModel.getXpByLevel(level + 1);

    // Calculate progress in percentage (0.0 - 1.0) and missing XP for the next level
    const progress = ((xp - current_level_xp) / (next_level_xp - current_level_xp));
    const missing_xp = next_level_xp - xp;

    // Successful response with level and the provided XP
    res.status(200).json({ level, xp, progress: Number(progress.toFixed(2)), missing_xp });
  } catch (error) {
    console.error('Error getting level by experience:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
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
