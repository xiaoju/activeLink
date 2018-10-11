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

  if (err.name === 'CastError') {
    // if session id gets corrupted, this deletes the cookie from client browser.
    req.session = null;
    req.logout;
    return res.sendStatus(500);
  }

  return res.sendStatus(err.status || 500);
};
