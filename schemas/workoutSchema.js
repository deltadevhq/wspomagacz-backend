const Joi = require('joi');
const moment = require('moment-timezone');
const { baseUserSchema } = require('./userSchema');
const { baseExerciseSchema } = require('./exerciseSchema');
const { applicationTimezone } = require('../config/settings');

/**
 * Base validation schema for sets data
 */
const baseSetsSchema = {
  reps: Joi.number()
    .integer()
    .positive()
    .max(1000)
    .required()
    .messages({
      'number.base': 'Reps must be a number',
      'number.integer': 'Reps must be an integer',
      'number.positive': 'Reps must be a positive number',
      'number.max': 'Reps must be less than or equal to 1000',
      'any.required': 'Reps are required',
    }),

  weight: Joi.number()
    .integer()
    .min(0)
    .max(500)
    .required()
    .messages({
      'number.base': 'Weight must be a number',
      'number.integer': 'Weight must be an integer',
      'number.min': 'Weight must be greater than or equal to 0',
      'number.max': 'Weight must be less than or equal to 500',
      'any.required': 'Weight is required',
    }),

  order: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .required()
    .messages({
      'number.base': 'Order must be a number',
      'number.integer': 'Order must be an integer',
      'number.min': 'Order must be greater than or equal to 0',
      'number.max': 'Order must be less than or equal to 50',
      'any.required': 'Order is required',
    }),
};

/**
 * Base validation schema for exercise data
 */
const baseWorkoutSchema = {
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number',
    }),

  related_workout_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.base': 'Related workout ID must be a number',
      'number.integer': 'Related workout ID must be an integer',
      'number.positive': 'Related workout ID must be a positive number',
    }),

  user_id: baseUserSchema.id,

  name: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^(?!.*\s{2,})[A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+(?: [A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+)*$/)
    .messages({
      'string.min': 'Workout name must be at least 3 characters long',
      'string.max': 'Workout name must be at most 100 characters long',
      'string.pattern.base': 'Workout name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.',
    }),

  exercises: Joi.array()
    .items(
      Joi.object({
        exercise: Joi.object(baseExerciseSchema)
          .required()
          .messages({
            'any.required': 'Exercise is required',
          }),
        sets: Joi.array()
          .items(
            baseSetsSchema,
          )
          .required()
          .messages({
            'any.required': 'Sets are required',
            'array.base': 'Sets must be an array of set objects',
          }),
        order: Joi.number()
          .integer()
          .min(0)
          .max(50)
          .required()
          .messages({
            'number.base': 'Order must be a number',
            'number.integer': 'Order must be an integer',
            'number.min': 'Order must be greater than or equal to 0',
            'number.max': 'Order must be less than or equal to 50',
            'any.required': 'Order is required',
          }),
      }),
    )
    .messages({
      'array.base': 'Exercises must be an array of objects which contains "exercise" object, "sets" array of objects and "order" number',
    }),

  date: Joi.date()
    .iso()
    .less('2100-01-01')
    .greater('1900-01-01')
    .messages({
      'date.less': 'Date must be a date before January 1st, 2100',
      'date.greater': 'Date must be after January 1st, 1900',
      'date.base': 'Date must be a valid date',
      'date.iso': 'Date must be in the format YYYY-MM-DD',
    }),

  started_at: Joi.date()
    .iso()
    .less('now')
    .greater('1900-01-01')
    .allow(null)
    .messages({
      'date.less': 'Start date must be a date before today',
      'date.greater': 'Start date must be after January 1st, 1900',
      'date.base': 'Start date must be a valid date',
      'date.iso': 'Start date must be in the format YYYY-MM-DDTHH:MM:SS',
    }),

  finished_at: Joi.date()
    .iso()
    .less('now')
    .greater('1900-01-01')
    .allow(null)
    .messages({
      'date.less': 'Finish date must be a date before today',
      'date.greater': 'Finish date must be after January 1st, 1900',
      'date.base': 'Finish date must be a valid date',
      'date.iso': 'Finish date must be in the format YYYY-MM-DDTHH:MM:SS',
    }),

  status: Joi.string()
    .valid('completed', 'in_progress', 'planned', 'skipped')
    .messages({
      'any.only': 'Workout status must be one of completed, in_progress, planned or skipped',
    }),

  notes: Joi.string()
    .max(100)
    .allow(null, '')
    .pattern(/^(?!.*\s{,100})[A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż!.,]+(?: [A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż!.,]+)*$/)
    .messages({
      'string.max': 'Notes must be at most 100 characters long',
      'string.pattern.base': 'Notes must contain only letters, numbers, spaces and selected special characters(!.,). You are required to use at least 3 alphanumeric symbols and can only use one space between words.',
    }),
};

/**
 * Specific validation schema for fetching workouts
 */
const getWorkoutSchema = Joi.object({
  status: baseWorkoutSchema.status,
  user_id: baseUserSchema.id,
  date: baseWorkoutSchema.date,
});

/**
 * Specific validation schema for fetching workout by its id
 */
const getWorkoutByIdSchema = Joi.object({
  id: baseWorkoutSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

/**
 * Specific validation schema for workout creation or update
 */
const putWorkoutSchema = Joi.object({
  name: baseWorkoutSchema.name.required().messages({ 'any.required': 'Name is required' }),
  exercises: baseWorkoutSchema.exercises.required().messages({ 'any.required': 'Exercises are required' }),
  date: baseWorkoutSchema.date.required().messages({ 'any.required': 'Date is required' }),
  ...baseWorkoutSchema,
});

/**
 * Specific validation schema for deleting workout
 */
const deleteWorkoutSchema = Joi.object({
  id: baseWorkoutSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

/**
 * Specific validation schema for starting workout
 */
const startWorkoutSchema = Joi.object({
  id: baseWorkoutSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

/**
 * Specific validation schema for stopping workout
 */
const stopWorkoutSchema = Joi.object({
  id: baseWorkoutSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

/**
 * Specific validation schema for finishing workout
 */
const finishWorkoutSchema = Joi.object({
  id: baseWorkoutSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

/**
 * Specific validation schema to check if workout date is today
 */
const isWorkoutDateToday = Joi.object({
  date: Joi.date()
    .custom((value, helpers) => {
      const todayDate = moment().tz(applicationTimezone).startOf('day');
      const inputDate = moment(value).tz(applicationTimezone).startOf('day');

      if (!inputDate.isSame(todayDate, 'day')) {
        return helpers.message('Workout date must be today');
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'Date is required',
    }),
});

/**
 * Specific validation schema to check if workout date is not in the past
 */
const isWorkoutDateNotInPast = Joi.object({
  date: Joi.date()
    .custom((value, helpers) => {
      const todayDate = moment().tz(applicationTimezone).startOf('day');
      const inputDate = moment(value).tz(applicationTimezone).startOf('day');

      if (inputDate.isBefore(todayDate, 'day')) {
        return helpers.message('Workout date must not be in the past');
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'Date is required',
    }),
});

module.exports = {
  baseWorkoutSchema,
  baseSetsSchema,
  getWorkoutSchema,
  getWorkoutByIdSchema,
  putWorkoutSchema,
  deleteWorkoutSchema,
  startWorkoutSchema,
  stopWorkoutSchema,
  finishWorkoutSchema,
  isWorkoutDateToday,
  isWorkoutDateNotInPast,
};
