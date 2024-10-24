const { describe, test, expect } = require('@jest/globals');
const { baseExperienceSchema } = require('./experienceSchema');

describe('Experience Schema test', () => {
  describe('Level Validation', () => {
    test('Level with negative number should fail', () => {
      const level = -1;

      const { error } = baseExperienceSchema.level.validate(level);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Level must be a positive number');
    });

    test('Level with zero should fail', () => {
      const level = 0;

      const { error } = baseExperienceSchema.level.validate(level);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Level must be a positive number');
    });

    test('Level with decimal should fail', () => {
      const level = 1.5;

      const { error } = baseExperienceSchema.level.validate(level);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Level must be an integer');
    });

    test('Level with string should fail', () => {
      const level = '1a';

      const { error } = baseExperienceSchema.level.validate(level);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Level must be a number');
    });

    test('Level with a valid number should pass', () => {
      const level = 1;

      const { error } = baseExperienceSchema.level.validate(level);

      expect(error).toBeUndefined();
    });

    test('Level with number higher than 1000 should fail', () => {
      const level = 1001;

      const { error } = baseExperienceSchema.level.validate(level);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Level must be at most 1000');
    });
  });
  describe('XP Validation', () => {
    test('XP with negative number should fail', () => {
      const xp = -1;

      const { error } = baseExperienceSchema.xp.validate(xp);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('XP must be a positive number');
    });

    test('XP with zero should fail', () => {
      const xp = 0;

      const { error } = baseExperienceSchema.xp.validate(xp);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('XP must be a positive number');
    });

    test('XP with decimal should fail', () => {
      const xp = 1.5;

      const { error } = baseExperienceSchema.xp.validate(xp);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('XP must be an integer');
    });

    test('XP with string should fail', () => {
      const xp = '1a';

      const { error } = baseExperienceSchema.xp.validate(xp);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('XP must be a number');
    });

    test('XP with a valid number should pass', () => {
      const xp = 1;

      const { error } = baseExperienceSchema.xp.validate(xp);

      expect(error).toBeUndefined();
    });

    test('XP with number higher than 10100000 should fail', () => {
      const xp = 10100001;

      const { error } = baseExperienceSchema.xp.validate(xp);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('XP must be at most 10100000');
    });
  });
});
