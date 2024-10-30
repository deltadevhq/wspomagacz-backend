const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const JoiPassword = Joi.extend(joiPasswordExtendCore);

/**
 * Base validation schema for user data
 */
const baseUserSchema = {
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number',
    }),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .messages({
      'string.alphanum': 'Username must only contain letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must be at most 30 characters long',
    }),

  display_name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^(?!.*\s{2,})[A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+(?: [A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+)*$/)
    .messages({
      'string.min': 'Display name must be at least 3 characters long',
      'string.max': 'Display name must be at most 30 characters long',
      'string.pattern.base': 'Display name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one spacebar between words.',
    }),

  password: JoiPassword.string()
    .min(8)
    .max(100)
    .minOfUppercase(1)
    .minOfLowercase(1)
    .minOfNumeric(1)
    .minOfSpecialCharacters(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must be at most 100 characters long',
      'password.minOfUppercase': 'Password must contain at least {#min} uppercase character',
      'password.minOfLowercase': 'Password must contain at least {#min} lowercase character',
      'password.minOfNumeric': 'Password must contain at least {#min} numeric character',
      'password.minOfSpecialCharacters': 'Password must contain at least {#min} special character',
      'password.noWhiteSpaces': 'Password must not contain white spaces',
      'password.onlyLatinCharacters': 'Password must contain only latin characters',
    }),

  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),

  gender: Joi.string()
    .valid('Male', 'Female', 'Not specified')
    .messages({
      'any.only': 'Gender must be one of Male, Female, or Not specified',
    }),

  birthday: Joi.date()
    .iso()
    .less('now')
    .greater('1900-01-01')
    .messages({
      'date.less': 'Birthday must be a date before today',
      'date.greater': 'Birthday must be after January 1st, 1900',
      'date.base': 'Birthday must be a valid date',
      'date.iso': 'Birthday must be in the format YYYY-MM-DD',
    }),

  weights: Joi.array()
    .items(
      Joi.object({
        weight: Joi.number()
          .positive()
          .max(250)
          .precision(1)
          .prefs({ convert: false }) // Do not convert number precision, instead validate it
          .required()
          .messages({
            'number.base': 'Weight must be a number',
            'number.positive': 'Weight must be a positive number',
            'number.max': 'Weight must be less than or equal to 250',
            'any.required': 'Weight is required',
          }),
        date: Joi.date()
          .iso()
          .less('now')
          .greater('1900-01-01')
          .required()
          .messages({
            'date.less': 'Date must be a date before today',
            'date.greater': 'Date must be after January 1st, 1900',
            'date.base': 'Date must be a valid date',
            'date.iso': 'Date must be in the format YYYY-MM-DD',
            'any.required': 'Date is required',
          }),
      }),
    )
    .messages({
      'array.base': 'Weights must be an array of weight objects',
    }),

  height: Joi.number()
    .integer()
    .positive()
    .max(250)
    .messages({
      'number.base': 'Height must be a number',
      'number.integer': 'Height must be an integer',
      'number.positive': 'Height must be a positive number',
      'number.max': 'Height must be at most 250',
    }),
};

/**
 * Specific validation schema for searching user profile
 * Requires either `id` or `username`, but not both.
 */
const searchUserProfileSchema = Joi.object({
  id: baseUserSchema.id.optional(),
  username: baseUserSchema.username.optional()
}).xor('id', 'username').messages({
    'object.missing': 'Please provide either an ID or a username.',
    'object.xor': 'Please provide either an ID or a username, but not both.'
});

/**
 * Specific validation schema for patching user
 */
const patchUserSchema = Joi.object({
  id: baseUserSchema.id.required().messages({ 'any.required': 'ID is required' }),
  ...baseUserSchema,
});

/**
 * Specific validation schema for deleting user
 */
const deleteUserSchema = Joi.object({
  id: baseUserSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

/**
 * Specific validation schema for user login
 */
const loginSchema = Joi.object({
  username: Joi.alternatives()
    .try(
      baseUserSchema.username.required().messages({ 'any.required': 'Username is required' }),
      baseUserSchema.email.required().messages({ 'any.required': 'Email is required' })
    ).messages({
      'alternatives.match': 'Either a valid username or a valid email is required.'
    }),
  password: baseUserSchema.password.required().messages({ 'any.required': 'Password is required' }),
});

/**
 * Specific validation schema for user registration
 */
const registerSchema = Joi.object({
  username: baseUserSchema.username.required().messages({ 'any.required': 'Username is required' }),
  password: baseUserSchema.password.required().messages({ 'any.required': 'Password is required' }),
  email: baseUserSchema.email.required().messages({ 'any.required': 'Email is required' }),
});

/**
 * Specific validation schema for user password change
 */
const patchPasswordSchema = Joi.object({
  password: baseUserSchema.password.required().messages({ 'any.required': 'Password is required' }),
  new_password: baseUserSchema.password.required().messages({ 'any.required': 'New password is required' }),
});

module.exports = {
  baseUserSchema,
  searchUserProfileSchema,
  patchUserSchema,
  deleteUserSchema,
  loginSchema,
  registerSchema,
  patchPasswordSchema,
};
