const { NotFoundError } = require('../errors/databaseErrors');

module.exports = (req, res, next) => {
  next(new NotFoundError('ruta'));
};