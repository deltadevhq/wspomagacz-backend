const Joi = require('joi');
const { baseRequestSchema } = require('./requestSchema');

/**
 * Base validation schema for muscle request data
 */
const baseMuscleSchema = {
  id: baseRequestSchema.id.required().messages({ 'any.required': 'ID is required' }),

  name: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^(?!.*\s{2,})[A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+(?: [A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+)*$/)
    .required()
    .messages({
      'string.min': 'Muscle name must be at least 3 characters long',
      'string.max': 'Muscle name must be at most 100 characters long',
      'string.pattern.base': 'Muscle name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.',
      'any.required': 'Muscle name is required',
    }),
}

/**
 * Specific validation schema for fetching single muscle by its id
 */
const fetchMuscleByIdSchema = Joi.object({
  id: baseMuscleSchema.id,
})

module.exports = {
  baseMuscleSchema,
  fetchMuscleByIdSchema,
}