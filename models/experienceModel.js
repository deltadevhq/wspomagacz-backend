/**
 * Function to calculate the level based on provided XP
 * @param {number} xp - The total XP earned by the user
 * @returns {number} - The level corresponding to the provided XP
 */
const getLevelByXp = async (xp) => {
  let level = 1;

  // Loop through levels and calculate cumulative XP until the provided XP matches or exceeds the required XP
  while (true) {
    const requiredXPForNextLevel = await getXpByLevel(level + 1);
    if (requiredXPForNextLevel > xp) break;
    level++;
  }

  return level;
};

/**
 * Function to calculate total required XP to reach a specific level
 * @param {number} level - The target level the user wants to reach
 * @returns {number} - The total required XP to reach the provided level
 */
const getXpByLevel = async (level) => {
  if (level === 1) return 0;

  const requiredXP = (100 + (10 * --level)) * level;
  return requiredXP;
};

module.exports = {
  getLevelByXp,
  getXpByLevel,
}