const Joi = require('joi');

// Base validation schema for muscle data
const baseMuscleSchema = {
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number',
      'any.required': 'ID is required'
    }),

  name: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^(?!.*\s{2,})[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/)
    .required()
    .messages({
      'string.min': 'Muscle name must be at least 3 characters long',
      'string.max': 'Muscle name must be at most 100 characters long',
      'string.pattern.base': 'Muscle name must contain only letters, numbers, and spaces. You are required to use atleast 3 alphanumeric symbols and can only use one spacebar between words.',
      'any.required': 'Muscle name is required'
    })
};

// Specific validation schema for fetching single muscle by its id
const getMuscleSchema = Joi.object({
  id: baseMuscleSchema.id
});

module.exports = {
  baseMuscleSchema,
  getMuscleSchema
};