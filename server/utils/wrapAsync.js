// https://thecodebarbarian.com/80-20-guide-to-express-error-handling
// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
// Make sure to `.catch()` any errors and pass them along to the `next()`
// middleware in the chain, in this case the error handler.

// function wrapAsync(fn) {
//   return function(req, res, next) {
//     fn(req, res, next).catch(next);
//   };
// }

module.exports = fn => (req, res, next) => fn(req, res, next).catch(next);

// module.exports = fn => (...args) => fn(...args).catch(args[2]);
