const Joi = require('joi');
const { baseRequestSchema } = require('./requestSchema');

/**
 * Base validation schema for notification request data
 */
const baseNotificationSchema = {
  id: baseRequestSchema.id,
};

const getNotificationByIdSchema = Joi.object({
  id: baseNotificationSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

const postMarkAsReadByIdSchema = Joi.object({
  id: baseNotificationSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

const postMarkAllAsReadSchema = Joi.object({
  user_id: baseNotificationSchema.id.required().messages({ 'any.required': 'ID is required' }),
});

module.exports = {
  baseNotificationSchema,
  getNotificationByIdSchema,
  postMarkAsReadByIdSchema,
  postMarkAllAsReadSchema,
};