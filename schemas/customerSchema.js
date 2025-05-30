const Joi = require('joi');
const { ValidationError } = require('../errors/databaseErrors');

const customerSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\d{3}-\d{3}-\d{4}$/).required()
});

function validateCustomer(data) {
  const { error, value } = customerSchema.validate(data, { abortEarly: false });
  if (error) {
    throw new ValidationError(error.details);
  }
  return value;
}

module.exports = validateCustomer;