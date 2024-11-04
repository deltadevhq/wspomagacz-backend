const Joi = require('joi');

/**
 * Base validation schema for request data
 */
const baseRequestSchema = {
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number',
    }),

  offset: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Offset must be a number',
      'number.integer': 'Offset must be an integer',
      'number.positive': 'Offset must be a positive number',
    }),

  limit: Joi.number()
    .integer()
    .positive()
    .max(100)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.positive': 'Limit must be a positive number',
      'number.max': 'Limit cannot exceed 100',
    }),
}

module.exports = {
  baseRequestSchema,
}