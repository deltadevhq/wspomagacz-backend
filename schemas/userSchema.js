const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const JoiPassword = Joi.extend(joiPasswordExtendCore);

// Base validation schema for user data
const baseUserSchema = {
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .messages({
      'string.alphanum': 'Username must only contain letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must be at most 30 characters long',
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
      'string.email': 'Please provide a valid email address'
    })
};

// Specific validation schema for user login
const loginSchema = Joi.object({
  username: baseUserSchema.username.required().messages({ 'any.required': 'Username is required' }),
  password: baseUserSchema.password.required().messages({ 'any.required': 'Password is required' }),
});

// Specific validation schema for user registration
const registerSchema = Joi.object({
  username: baseUserSchema.username.required().messages({ 'any.required': 'Username is required' }),
  password: baseUserSchema.password.required().messages({ 'any.required': 'Password is required' }),
  email: baseUserSchema.email.required().messages({ 'any.required': 'Email is required' }),
});

module.exports = {
  registerSchema,
  loginSchema
};