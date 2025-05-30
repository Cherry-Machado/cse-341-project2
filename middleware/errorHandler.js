// middleware/errorHandler.js
const { MongoError } = require('mongodb');
const { 
  DatabaseError, 
  CastError, 
  DuplicateError, 
  ValidationError,
  NotFoundError
} = require('../errors/databaseErrors');

function errorHandler(err, req, res, next) {
  console.error('Error occurred:', err.stack);

  // Standard error response structure
  const baseErrorResponse = {
    success: false,
    error: {
      type: 'server_error',
      message: 'An unexpected error occurred',
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      details: {}
    }
  };

  // Handle custom DatabaseError instances
  if (err instanceof DatabaseError) {
    baseErrorResponse.error.type = err.type;
    baseErrorResponse.error.message = err.message;
    baseErrorResponse.error.statusCode = err.statusCode;

    // Enhanced error details based on error type
    if (err instanceof CastError) {
      baseErrorResponse.error.details = {
        field: err.field,
        invalidValue: err.value,
        expectedType: 'ObjectId',
        suggestion: 'Please provide a valid MongoDB ObjectId'
      };
    } 
    else if (err instanceof DuplicateError) {
      baseErrorResponse.error.details = {
        field: err.field,
        constraint: 'unique',
        suggestion: 'The value must be unique across all documents'
      };
    } 
    else if (err instanceof ValidationError) {
      baseErrorResponse.error.details = {
        validationErrors: err.details.map(detail => ({
          field: detail.path.join('.'),
          code: detail.type,
          message: detail.message,
          providedValue: detail.context.value
        })),
        suggestion: 'Please review the validation requirements'
      };
    } 
    else if (err instanceof NotFoundError) {
      baseErrorResponse.error.details = {
        resourceType: err.resource,
        suggestion: err.resource === 'route' 
          ? 'Check the API documentation for available endpoints' 
          : 'The requested resource may have been deleted or never existed'
      };
      
      if (err.resource === 'route') {
        baseErrorResponse.error.details.documentation = `${req.protocol}://${req.get('host')}/api-docs`;
      }
    }
  }
  // Handle MongoDB native errors
  else if (err instanceof MongoError) {
    baseErrorResponse.error.type = 'database_error';
    baseErrorResponse.error.message = 'Database operation failed';
    baseErrorResponse.error.details = {
      code: err.code,
      codeName: err.codeName
    };

    switch (err.code) {
      case 11000: {
        const duplicateField = Object.keys(err.keyPattern)[0];
        baseErrorResponse.error.statusCode = 409;
        baseErrorResponse.error.type = 'duplicate_key';
        baseErrorResponse.error.message = `Duplicate value for field: ${duplicateField}`;
        baseErrorResponse.error.details.field = duplicateField;
        baseErrorResponse.error.details.conflictingValue = err.keyValue[duplicateField];
        break;
      }
      case 2:
        baseErrorResponse.error.statusCode = 400;
        baseErrorResponse.error.type = 'invalid_value';
        baseErrorResponse.error.message = 'Invalid value provided';
        break;
      case 121:
        baseErrorResponse.error.statusCode = 422;
        baseErrorResponse.error.type = 'validation_failed';
        baseErrorResponse.error.message = 'Document validation failed';
        baseErrorResponse.error.details.validationErrors = err.errInfo?.details?.schemaRulesNotSatisfied;
        break;
    }
  }
  // Handle other JavaScript errors
  else {
    baseErrorResponse.error.details = {
      errorType: err.name,
      errorMessage: err.message
    };
  }

  // Development-only details
  if (process.env.NODE_ENV === 'development') {
    baseErrorResponse.error.stack = err.stack;
    if (err instanceof MongoError) {
      baseErrorResponse.error.internalDetails = {
        errInfo: err.errInfo,
        operationType: err.operationType
      };
    }
  }

  // Send the formatted error response
  res.status(baseErrorResponse.error.statusCode).json(baseErrorResponse);
}

module.exports = errorHandler;