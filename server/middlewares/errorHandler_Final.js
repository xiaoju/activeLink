const TokenTooOld = require('../errors/TokenTooOld');

module.exports = (err, req, res, next) => {
  err.privateBackendMessage = undefined;
  // NB privateBackendMessage must never be sent to client! (security issue)

  // if (err instanceof TokenTooOld) {
  //   console.log('AAAAAAAAAAAAA');
  // }

  if (res.headersSent) {
    console.log('ALREADY SENT');
    return next(err);
  }

  if (err.status) {
    return res.sendStatus(err.status);
  }
  return res.sendStatus(err.status);
};
