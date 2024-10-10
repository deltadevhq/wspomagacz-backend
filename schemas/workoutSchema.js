const Joi = require('joi');
const { baseUserSchema } = require('./userSchema');
const { baseExerciseSchema } = require('./exerciseSchema');


// Base validation schema for exercise data
const baseWorkoutSchema = {
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number'
    }),

  related_workout_id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number'
    }),

  user_id: baseUserSchema.id,

  name: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^(?!.*\s{2,})[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/)
    .messages({
      'string.min': 'Workout name must be at least 3 characters long',
      'string.max': 'Workout name must be at most 100 characters long',
      'string.pattern.base': 'Workout name must contain only letters, numbers, and spaces. You are required to use atleast 3 alphanumeric symbols and can only use one spacebar between words.'
    }),

  exercises: Joi.array()
    .items(
      Joi.object({
        exercise: Joi.object(baseExerciseSchema)
          .required()
          .messages({
            'any.required': 'Exercise is required'
          }),
        sets: Joi.array()
          .items(
            baseSetsSchema
          )
          .messages({
            'array.base': 'Sets must be an array of set objects'
          }),
        order: Joi.number()
          .integer()
          .positive()
          .max(50)
          .required()
          .messages({
            'number.base': 'Order must be a number',
            'number.integer': 'Order must be an integer',
            'number.positive': 'Order must be a positive number',
            'number.max': 'Order must be less than or equal to 50',
            'any.required': 'Order is required'
          }),
      })
    )
    .messages({
      'array.base': 'Exercises must be an array of objects which contains "exercise" object, "sets" array of objects and "order" number'
    }),

  date: Joi.date()
    .iso()
    .less('now')
    .greater('1900-01-01')
    .messages({
      'date.less': 'Date must be a date before today',
      'date.greater': 'Date must be after January 1st, 1900',
      'date.base': 'Date must be a valid date',
      'date.iso': 'Date must be in the format YYYY-MM-DD'
    }),

  started_at: Joi.date()
    .iso()
    .less('now')
    .greater('1900-01-01')
    .messages({
      'date.less': 'Start date must be a date before today',
      'date.greater': 'Start date must be after January 1st, 1900',
      'date.base': 'Start date must be a valid date',
      'date.iso': 'Start date must be in the format YYYY-MM-DDTHH:MM:SS'
    }),

  finished_at: Joi.date()
    .iso()
    .less('now')
    .greater('1900-01-01')
    .messages({
      'date.less': 'Finish date must be a date before today',
      'date.greater': 'Finish date must be after January 1st, 1900',
      'date.base': 'Finish date must be a valid date',
      'date.iso': 'Finish date must be in the format YYYY-MM-DDTHH:MM:SS'
    }),

  status: Joi.string()
    .valid('completed', 'in_progress', 'planned', 'skipped')
    .messages({
      'any.only': 'Workout status must be one of completed, in_progress, planned or skipped'
    }),

  notes: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^(?!.*\s{2,})[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/)
    .messages({
      'string.min': 'Notes must be at least 3 characters long',
      'string.max': 'Notes must be at most 100 characters long',
      'string.pattern.base': 'Notes must contain only letters, numbers, and spaces. You are required to use atleast 3 alphanumeric symbols and can only use one spacebar between words.'
    })
};

// Base validation schema for sets data
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
      'any.required': 'Reps are required'
    }),

  weight: Joi.number()
    .integer()
    .positive()
    .max(500)
    .required()
    .messages({
      'number.base': 'Weight must be a number',
      'number.integer': 'Weight must be an integer',
      'number.positive': 'Weight must be a positive number',
      'number.max': 'Weight must be less than or equal to 500',
      'any.required': 'Weight is required'
    }),

  order: Joi.number()
    .integer()
    .positive()
    .max(50)
    .required()
    .messages({
      'number.base': 'Order must be a number',
      'number.integer': 'Order must be an integer',
      'number.positive': 'Order must be a positive number',
      'number.max': 'Order must be less than or equal to 50',
      'any.required': 'Order is required'
    })
}


// TODO: FINISH

module.exports = {
  baseWorkoutSchema,
  baseSetsSchema
};