const levelModel = require('../models/levelModel');

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
    res.status(501).json({ message: 'Not implemented' });
};

module.exports = {
    getLevelByXp,
    getXpByLevel,
};
