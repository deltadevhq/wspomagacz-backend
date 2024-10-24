const { describe, it, expect } = require('@jest/globals');
const { getLevelByXp, getXpByLevel } = require('./experienceModel');

describe('Experience model', () => {
  it('getLevelByXp and getXpByLevel should be in sync', () => {
    for (let i = 1; i <= 100; i++) {
      const xp = getXpByLevel(i);
      expect(getLevelByXp(xp)).toBe(i);
    }
  });
});
