// https://medium.com/learn-with-talkrise/custom-errors-with-node-express-27b91fe2d947
// https://medium.com/@xpl/javascript-deriving-from-error-properly-8d2f8f315801
// https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
// https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216

class AppError extends Error {
  constructor(message, status) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong with the server.';
    this.status = status || 500;
  }
}

// https://medium.com/@xpl/javascript-deriving-from-error-properly-8d2f8f315801
// class MyError extends Error {
//    constructor (message) {
//       super (message)
//       this.constructor = MyError
//       this.__proto__   = MyError.prototype
//       this.message     = message
//    }
// }

module.exports = AppError;
