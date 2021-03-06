// https://medium.com/learn-with-talkrise/custom-errors-with-node-express-27b91fe2d947
// https://medium.com/@xpl/javascript-deriving-from-error-properly-8d2f8f315801
// https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
// https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Internal Server Error!';
    this.statusCode = statusCode || 500;
    // this.__proto__ = AppError.prototype; // is this necessary?!
  }
}

module.exports = AppError;
