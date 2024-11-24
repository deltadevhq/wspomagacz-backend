const Joi = require('joi');
const { baseEquipmentSchema } = require('./equipmentSchema');
const { baseMuscleSchema } = require('./muscleSchema');
const { baseRequestSchema } = require('./requestSchema');

/**
 * Base validation schema for exercise request data
 */
const baseExerciseSchema = {
  exercise_id: baseRequestSchema.id,

  exercise_name: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^(?!.*\s{2,})[A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+(?: [A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+)*$/)
    .messages({
      'string.min': 'Exercise name must be at least 3 characters long',
      'string.max': 'Exercise name must be at most 100 characters long',
      'string.pattern.base': 'Exercise name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.',
    }),

  equipment: Joi.array()
    .items(
      Joi.object(baseEquipmentSchema),
    )
    .messages({
      'array.base': 'Equipment must be an array of equipment objects',
    }),

  muscles: Joi.array()
    .items(
      Joi.object(baseMuscleSchema),
    )
    .messages({
      'array.base': 'Muscles must be an array of muscle objects',
    }),

  user_id: baseRequestSchema.id.allow(null),

  exercise_type: Joi.string()
    .valid('all', 'custom', 'standard')
    .messages({
      'any.only': 'Exercise type must be one of all, custom or standard',
    }),
}

/**
 * Specific validation schema for fetching exercises
 */
const fetchExercisesSchema = Joi.object({
  type: baseExerciseSchema.exercise_type,
  user_id: baseExerciseSchema.user_id,
  name: baseExerciseSchema.exercise_name
    .min(1)
    .messages({ 'string.min': 'Exercise name must be at least 1 character long' }),
  offset: baseRequestSchema.offset,
  limit: baseRequestSchema.limit,
})

/**
 * Specific validation schema for fetching exercise by its id
 */
const fetchExerciseByIdSchema = Joi.object({
  id: baseExerciseSchema.exercise_id.required().messages({ 'any.required': 'ID is required' }),
  type: baseExerciseSchema.exercise_type,
  user_id: baseExerciseSchema.user_id,
})

/**
 * Specific validation schema for posting exercise
 */
const postExerciseSchema = Joi.object({
  name: baseExerciseSchema.exercise_name.required().messages({ 'any.required': 'Exercise name is required' }),
  equipment: baseExerciseSchema.equipment.required().messages({ 'any.required': 'Equipment is required' }),
  muscles: baseExerciseSchema.muscles.required().messages({ 'any.required': 'Muscles are required' }),
})

/**
 * Specific validation schema for deleting exercise
 */
const deleteExerciseSchema = Joi.object({
  id: baseExerciseSchema.exercise_id.required().messages({ 'any.required': 'ID is required' }),
})

module.exports = {
  baseExerciseSchema,
  fetchExercisesSchema,
  fetchExerciseByIdSchema,
  postExerciseSchema,
  deleteExerciseSchema,
}