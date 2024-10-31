const Joi = require('joi');

const getNotificationByIdSchema = Joi.object({
  id: Joi.number().required(),
});

const postMarkAsReadByIdSchema = Joi.object({
  id: Joi.number().required(),
});

const postMarkAllAsReadSchema = Joi.object({
  user_id: Joi.number().required(),
});

module.exports = {
  getNotificationByIdSchema,
  postMarkAsReadByIdSchema,
  postMarkAllAsReadSchema,
};
