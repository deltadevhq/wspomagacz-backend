const Joi = require('joi');
const { baseRequestSchema } = require('./requestSchema');

/**
 * Base validation schema for activity request data
 */
const baseActivitySchema = {
  id: baseRequestSchema.id,
};

/**
 * Specific validation schema for fetching activities
 */
const fetchActivitiesSchema = Joi.object({
  user_id: baseActivitySchema.id,
  offset: baseRequestSchema.offset,
  limit: baseRequestSchema.limit,
});

/**
 * Specific validation schema for fetching friends activities
 */
const fetchFriendsActivitiesSchema = Joi.object({
  offset: baseRequestSchema.offset,
  limit: baseRequestSchema.limit,
});

module.exports = {
  baseActivitySchema,
  fetchActivitiesSchema,
  fetchFriendsActivitiesSchema,
};