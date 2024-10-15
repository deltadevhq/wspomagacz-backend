const pool = require('../config/database');

/**
 * 
 */
const getLevelByXp = async (xp) => {
};

/**
 * Function to calculate total required XP to reach a specific level
 * @param {number} level - The target level the user wants to reach
 * @returns {number} - The total required XP to reach the provided level
 */
const getXpByLevel = async (level) => {
  if (level < 1) throw new Error("Level must be greater than or equal to 1");
  if (level === 1) return 0;

  const requiredXP = (100 + (10 * --level)) * level;
  return requiredXP;
};

module.exports = {
  getLevelByXp,
  getXpByLevel,
}