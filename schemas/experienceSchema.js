const Joi = require('joi');

/**
 * Base validation schema for experience request data
 */
const baseExperienceSchema = {
  level: Joi.number()
    .integer()
    .positive()
    .max(1000)
    .messages({
      'number.base': 'Level must be a number',
      'number.integer': 'Level must be an integer',
      'number.positive': 'Level must be a positive number',
      'number.max': 'Level must be at most 1000',
    }),

  xp: Joi.number()
    .integer()
    .min(0)
    .max(10100000)
    .messages({
      'number.base': 'XP must be a number',
      'number.integer': 'XP must be an integer',
      'number.min': 'XP must be a positive number or 0',
      'number.max': 'XP must be at most 10100000',
    }),
};

/**
 * Specific validation schema for getting experience by level
 */
const getXpByLevelSchema = Joi.object({
  level: baseExperienceSchema.level.required().messages({ 'any.required': 'Level is required' }),
});

/**
 * Specific validation schema for getting level by experience
 */
const getLevelByXpSchema = Joi.object({
  xp: baseExperienceSchema.xp.required().messages({ 'any.required': 'XP is required' }),
});

module.exports = {
  baseExperienceSchema,
  getXpByLevelSchema,
  getLevelByXpSchema,
};