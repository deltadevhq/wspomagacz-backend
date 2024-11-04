const Joi = require('joi');
const { baseRequestSchema } = require('./requestSchema');

/**
 * Base validation schema for activity request data
 */
const baseActivitySchema = {
  id: baseRequestSchema.id,
}

/**
 * Specific validation schema for fetching activity
 */
const fetchActivitySchema = Joi.object({
  id: baseActivitySchema.id.required().messages({ 'any.required': 'ID is required' }),
})

/**
 * Specific validation schema for fetching activities
 */
const fetchActivitiesSchema = Joi.object({
  user_id: baseActivitySchema.id,
  offset: baseRequestSchema.offset,
  limit: baseRequestSchema.limit,
})

/**
 * Specific validation schema for fetching friends activities
 */
const fetchFriendsActivitiesSchema = Joi.object({
  offset: baseRequestSchema.offset,
  limit: baseRequestSchema.limit,
})

/**
 * Specific validation schema for deleting activity
 */
const deleteActivitySchema = Joi.object({
  id: baseActivitySchema.id.required().messages({ 'any.required': 'ID is required' }),
})

/**
 * Specific validation schema for liking activity
 */
const likeActivitySchema = Joi.object({
  id: baseActivitySchema.id.required().messages({ 'any.required': 'ID is required' }),
})

/**
 * Specific validation schema for unliking activity
 */
const unlikeActivitySchema = Joi.object({
  id: baseActivitySchema.id.required().messages({ 'any.required': 'ID is required' }),
})

module.exports = {
  baseActivitySchema,
  fetchActivitySchema,
  fetchActivitiesSchema,
  fetchFriendsActivitiesSchema,
  deleteActivitySchema,
  likeActivitySchema,
  unlikeActivitySchema,
}