const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    next();
  };
};

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createTask: Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().allow('').optional(),
    status: Joi.string().valid('todo', 'in_progress', 'done').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    dueDate: Joi.date().iso().optional()
  }),

  updateTask: Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().allow('').optional(),
    status: Joi.string().valid('todo', 'in_progress', 'done').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    dueDate: Joi.date().iso().allow(null).optional()
  }),

  updateUser: Joi.object({
    firstName: Joi.string().min(2).optional(),
    lastName: Joi.string().min(2).optional(),
    email: Joi.string().email().optional()
  })
};

module.exports = { validate, schemas };
