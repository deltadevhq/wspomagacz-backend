const Joi = require('joi');
const { baseUserSchema } = require('./userSchema');

/**
 * Specific validation schema for sending friend request
 */
const sendFriendRequestSchema = Joi.object({
  to_id: baseUserSchema.id.required().messages({ 'any.required': 'To_id is required' }),
});

/**
 * Specific validation schema for accepting friend request
 */
const acceptFriendRequestSchema = Joi.object({
  from_id: baseUserSchema.id.required().messages({ 'any.required': 'From_id is required' }),
});

/**
 * Specific validation schema for rejecting friend request
 */
const rejectFriendRequestSchema = Joi.object({
  from_id: baseUserSchema.id.required().messages({ 'any.required': 'From_id is required' }),
});

/**
 * Specific validation schema for removing friend
 */
const removeFriendSchema = Joi.object({
  id: baseUserSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

module.exports = {
  sendFriendRequestSchema,
  acceptFriendRequestSchema,
  rejectFriendRequestSchema,
  removeFriendSchema,
}