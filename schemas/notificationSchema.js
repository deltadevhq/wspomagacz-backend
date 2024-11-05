const Joi = require('joi');
const { baseRequestSchema } = require('./requestSchema');

/**
 * Base validation schema for notification request data
 */
const baseNotificationSchema = {
  id: baseRequestSchema.id,
}

/**
 * Base validation schema for fetching all notifications
 */
const fetchNotificationsSchema = Joi.object({
  offset: baseRequestSchema.offset,
  limit: baseRequestSchema.limit,
})

/**
 * Base validation schema for fetching notification by its id
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
  fetchNotificationsSchema,
  fetchNotificationByIdSchema,
  postMarkAsReadByIdSchema,
  postMarkAllAsReadSchema,
}