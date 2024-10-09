const Joi = require('joi');
const { baseEquipmentSchema } = require('./equipmentSchema');
const { baseMuscleSchema } = require('./muscleSchema');
const { baseUserSchema } = require('./userSchema');

// Base validation schema for exercise data
const baseExerciseSchema = {
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number'
    }),

  name: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^(?!.*\s{2,})[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/)
    .messages({
      'string.min': 'Exercise name must be at least 3 characters long',
      'string.max': 'Exercise name must be at most 100 characters long',
      'string.pattern.base': 'Exercise name must contain only letters, numbers, and spaces. You are required to use atleast 3 alphanumeric symbols and can only use one spacebar between words.'
    }),

  equipment: Joi.array()
    .items(
      Joi.object(baseEquipmentSchema)
    )
    .messages({
      'array.base': 'Equipment must be an array of equipment objects'
    }),

  muscles: Joi.array()
    .items(
      Joi.object(baseMuscleSchema)
    )
    .messages({
      'array.base': 'Muscles must be an array of muscle objects'
    }),

  user_id: baseUserSchema.id,

  exercise_type: Joi.string()
    .valid('all', 'custom', 'standard')
    .messages({
      'any.only': 'Exercise type must be one of all, custom or standard'
    })

};

// Specific validation schema for fetching exercises
const getExerciseSchema = Joi.object({
  type: baseExerciseSchema.exercise_type,
  user_id: baseExerciseSchema.user_id
});

// Specific validation schema for fetching exercise by its id
const getExerciseByIdSchema = Joi.object({
  id: baseExerciseSchema.id.required().messages({ 'any.required': 'ID is required' }),
  type: baseExerciseSchema.exercise_type,
  user_id: baseExerciseSchema.user_id
});

// Specific validation schema for posting exercise
const postExerciseSchema = Joi.object({
  name: baseExerciseSchema.name.required().messages({ 'any.required': 'Exercise name is required' }),
  equipment: baseExerciseSchema.equipment.required().messages({ 'any.required': 'Equipment is required' }),
  muscles: baseExerciseSchema.muscles.required().messages({ 'any.required': 'Muscles are required' })
});

// Specific validation schema for deleting exercise
const deleteExerciseSchema = Joi.object({
  id: baseExerciseSchema.id.required().messages({ 'any.required': 'ID is required' })
});

module.exports = {
  baseExerciseSchema,
  getExerciseSchema,
  getExerciseByIdSchema,
  postExerciseSchema,
  deleteExerciseSchema
};