const Joi = require('joi');
const { baseRequestSchema } = require('./requestSchema');

/**
 * Base validation schema for notification request data
 */
const baseNotificationSchema = {
  id: baseRequestSchema.id,
}

/**
 * Base validation schema for notification by its id
 */
const fetchNotificationByIdSchema = Joi.object({
  id: baseNotificationSchema.id.required().messages({ 'any.required': 'ID is required' }),
})

/**
 * Base validation schema for posting mark as read by notification id
 */
const postMarkAsReadByIdSchema = Joi.object({
  id: baseNotificationSchema.id.required().messages({ 'any.required': 'ID is required' }),
})

/**
 * Base validation schema for posting mark as read for all notification
 */
const postMarkAllAsReadSchema = Joi.object({
  user_id: baseNotificationSchema.id.required().messages({ 'any.required': 'ID is required' }),
})

module.exports = {
  baseNotificationSchema,
  fetchNotificationByIdSchema,
  postMarkAsReadByIdSchema,
  postMarkAllAsReadSchema,
}