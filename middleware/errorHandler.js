const { MongoError } = require('mongodb');
const { 
  DatabaseError, 
  CastError, 
  DuplicateError, 
  ValidationError,
  NotFoundError
} = require('../errors/databaseErrors');

// ==============================================
// Funciones auxiliares para manejo de errores
// ==============================================

const buildErrorResponse = (req) => ({
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
});

const handleDatabaseError = (err, errorResponse, req) => {
  errorResponse.error.type = err.type;
  errorResponse.error.message = err.message;
  errorResponse.error.statusCode = err.statusCode;

  if (err instanceof CastError) {
    errorResponse.error.details = {
      field: err.field,
      invalidValue: err.value,
      expectedType: 'ObjectId',
      suggestion: 'Please provide a valid MongoDB ObjectId'
    };
  } else if (err instanceof DuplicateError) {
    errorResponse.error.details = {
      field: err.field,
      constraint: 'unique',
      suggestion: 'The value must be unique across all documents'
    };
  } else if (err instanceof ValidationError) {
    errorResponse.error.details = {
      validationErrors: err.details.map(detail => ({
        field: detail.path.join('.'),
        code: detail.type,
        message: detail.message,
        providedValue: detail.context.value
      })),
      suggestion: 'Please review the validation requirements'
    };
  } else if (err instanceof NotFoundError) {
    errorResponse.error.details = {
      resourceType: err.resource,
      suggestion: err.resource === 'route' 
        ? 'Check the API documentation for available endpoints' 
        : 'The requested resource may have been deleted or never existed'
    };
    
    if (err.resource === 'route') {
      errorResponse.error.details.documentation = `${req.protocol}://${req.get('host')}/api-docs`;
    }
  }
};

const handleMongoError = (err, errorResponse) => {
  errorResponse.error.type = 'database_error';
  errorResponse.error.message = 'Database operation failed';
  errorResponse.error.details = {
    code: err.code,
    codeName: err.codeName
  };

  switch (err.code) {
    case 11000: {
      const duplicateField = Object.keys(err.keyPattern)[0];
      errorResponse.error.statusCode = 409;
      errorResponse.error.type = 'duplicate_key';
      errorResponse.error.message = `Duplicate value for field: ${duplicateField}`;
      errorResponse.error.details.field = duplicateField;
      errorResponse.error.details.conflictingValue = err.keyValue[duplicateField];
      break;
    }
    case 2:
      errorResponse.error.statusCode = 400;
      errorResponse.error.type = 'invalid_value';
      errorResponse.error.message = 'Invalid value provided';
      break;
    case 121:
      errorResponse.error.statusCode = 422;
      errorResponse.error.type = 'validation_failed';
      errorResponse.error.message = 'Document validation failed';
      errorResponse.error.details.validationErrors = err.errInfo?.details?.schemaRulesNotSatisfied;
      break;
  }
};

const addDevelopmentDetails = (err, errorResponse) => {
  errorResponse.error.stack = err.stack;
  if (err instanceof MongoError) {
    errorResponse.error.internalDetails = {
      errInfo: err.errInfo,
      operationType: err.operationType
    };
  }
};

// ==============================================
// Middlewares de manejo de errores
// ==============================================

const handleJsonErrors = (err, req, res, next) => {
  if (err.type === 'invalid_json' || (err instanceof SyntaxError && err.status === 400)) {
    console.error('Invalid JSON detected:', err.message);
    
    return res.status(400).json({
      success: false,
      error: {
        type: 'invalid_json',
        message: 'Invalid JSON payload',
        statusCode: 400,
        timestamp: new Date().toISOString(),
        details: {
          suggestion: 'Verify your JSON syntax and ensure all strings are quoted',
          commonMistakes: [
            'Unquoted values (use "value" instead of value)',
            'Trailing commas in objects/arrays',
            'Invalid number formats',
            'Missing commas between properties'
          ],
          validExample: {
            "name": "Product Name",
            "price": 29.99,
            "stock": 100,
            "specifications": "64GB RAM"
          }
        }
      }
    });
  }
  next(err);
};

const handleAppErrors = (err, req, res, next) => {
  console.error(`Application error [${err.name}]:`, err.message);

  const errorResponse = buildErrorResponse(req);
  errorResponse.error.message = err.message;

  if (err instanceof DatabaseError) {
    handleDatabaseError(err, errorResponse, req);
  } else if (err instanceof MongoError) {
    handleMongoError(err, errorResponse);
  } else {
    errorResponse.error.details = {
      errorType: err.name,
      errorMessage: err.message
    };
  }

  if (process.env.NODE_ENV === 'development') {
    addDevelopmentDetails(err, errorResponse);
  }

  res.status(errorResponse.error.statusCode).json(errorResponse);
};

// ==============================================
// Exportación de middlewares
// ==============================================

module.exports = {
  handleJsonErrors,
  handleAppErrors
};