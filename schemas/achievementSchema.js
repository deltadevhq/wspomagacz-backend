const Joi = require('joi');
const { baseRequestSchema } = require('./requestSchema');

/**
 * Base validation schema for achievement request data
 */
const baseAchievementSchema = {
  id: baseRequestSchema.id,
}

/**
 * Specific validation schema for fetching achievement
 */
const fetchAchievementByIdSchema = Joi.object({
  id: baseAchievementSchema.id.required().messages({ 'any.required': 'ID is required' }),
})

module.exports = {
  baseAchievementSchema,
  fetchAchievementByIdSchema,
}