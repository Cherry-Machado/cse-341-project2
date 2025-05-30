// middleware/errorHandler.js
const { MongoError } = require('mongodb');
const { 
  CastError, 
  DuplicateError, 
  ValidationError,
  NotFoundError
} = require('../errors/databaseErrors');

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Errores personalizados
  if (err instanceof CastError) {
    return res.status(err.statusCode).json({
      status: 'error',
      type: err.type,
      message: err.message,
      field: err.field,
      value: err.value
    });
  }

  if (err instanceof DuplicateError) {
    return res.status(err.statusCode).json({
      status: 'error',
      type: err.type,
      message: err.message,
      field: err.field
    });
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      status: 'error',
      type: err.type,
      message: err.message,
      details: err.details
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      status: 'error',
      type: err.type,
      message: err.message,
      resource: err.resource
    });
  }

  // Errores de MongoDB
  if (err instanceof MongoError) {
    switch (err.code) {
      case 11000:
        const key = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
          status: 'error',
          type: 'DUPLICATE_ERROR',
          message: `Theres already a register that have the datavalue given in '${key}'`,
          field: key
        });
      case 2: // BadValue (similar a CastError)
        return res.status(400).json({
          status: 'error',
          type: 'CAST_ERROR',
          message: 'Invalid datavalue given'
        });
      default:
        return res.status(500).json({
          status: 'error',
          message: 'Database Error'
        });
    }
  }

  // Error genérico
  res.status(500).json({ 
    status: 'error',
    message: 'Server internal error' 
  });
}

module.exports = errorHandler;