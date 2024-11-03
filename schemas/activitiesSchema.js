const Joi = require('joi');
const { baseRequestSchema } = require('./requestSchema');

/**
 * Base validation schema for activity request data
 */
const baseActivitySchema = {
  id: baseRequestSchema.id,
};

/**
 * Specific validation schema for fetching friends activities
 */
const getFriendsActivitiesSchema = Joi.object({
  offset: baseRequestSchema.offset,
  limit: baseRequestSchema.limit,
});

module.exports = {
  baseActivitySchema,
  getFriendsActivitiesSchema,
};