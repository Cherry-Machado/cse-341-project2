const { ObjectId } = require('mongodb');
const { CastError } = require('../errors/databaseErrors');

function validateObjectId(id) {
  if (!ObjectId.isValid(id)) {
    throw new CastError('id', id);
  }
  return new ObjectId(id);
}

module.exports = {
  validateObjectId
};