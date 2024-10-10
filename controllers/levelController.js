const levelModel = require('../models/levelModel');

const getLevelByXp = async (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
};

const getXpByLevel = async (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
};

module.exports = {
    getLevelByXp,
    getXpByLevel,
};
