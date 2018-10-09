const AppError = require('../errors/AppError');
const OrderNotFoundError = require('../errors/OrderNotFoundError');
const UserNotFoundError = require('../errors/UserNotFoundError');

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof UserNotFoundError) {
    // return res.status(401).send(err.message);
    // return res.status(err.status).send(err.message);
    return res.status(err.status).send(err);
  }

  // if (err instanceof MongoError) {
  //   return res.status(500).send(err.message);
  // }

  return res.status(500).json({ err });
};
