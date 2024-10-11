const Joi = require('joi');

// Base validation schema for equipment data
const baseEquipmentSchema = {
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID must be a number',
            'number.integer': 'ID must be an integer',
            'number.positive': 'ID must be a positive number',
            'any.required': 'ID is required',
        }),

    name: Joi.string()
        .min(3)
        .max(100)
        .pattern(/^(?!.*\s{2,})[A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+(?: [A-Za-z0-9ĄąĆćĘęŁłŃńÓóŚśŹźŻż]+)*$/)
        .required()
        .messages({
            'string.min': 'Equipment name must be at least 3 characters long',
            'string.max': 'Equipment name must be at most 100 characters long',
            'string.pattern.base': 'Equipment name must contain only letters, numbers, and spaces. You are required to use atleast 3 alphanumeric symbols and can only use one spacebar between words.',
            'any.required': 'Equipment name is required',
        }),
};

// Specific validation schema for fetching single equipment by its id
const getEquipmentSchema = Joi.object({
    id: baseEquipmentSchema.id,
});

module.exports = {
    baseEquipmentSchema,
    getEquipmentSchema,
};
