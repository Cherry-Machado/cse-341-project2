// errors/databaseErrors.js
class DatabaseError extends Error {
  constructor(message, type, statusCode = 400) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.name = "DatabaseError";
  }
}

class CastError extends DatabaseError {
  constructor(field, value) {
    super(`The datavalue '${value}' isnt valid for the field '${field}'`, 'CAST_ERROR', 400);
    this.field = field;
    this.value = value;
  }
}

class DuplicateError extends DatabaseError {
  constructor(field) {
    super(`Theres already a register that have the datavalue given in '${field}'`, 'DUPLICATE_ERROR', 409);
    this.field = field;
  }
}

class ValidationError extends DatabaseError {
  constructor(details) {
    super('Validation Error', 'VALIDATION_ERROR', 400);
    this.details = details;
  }
}

class NotFoundError extends DatabaseError {
  constructor(resource) {
    super(`The resource '${resource}' was not found`, 'NOT_FOUND', 404);
    this.resource = resource;
  }
}

module.exports = { 
  DatabaseError, 
  CastError, 
  DuplicateError, 
  ValidationError,
  NotFoundError
};