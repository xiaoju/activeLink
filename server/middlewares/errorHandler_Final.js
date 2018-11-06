const TokenTooOld = require('../errors/TokenTooOld');

module.exports = (err, req, res, next) => {
  err.privateBackendMessage = undefined;
  // NB privateBackendMessage must never be sent to client! (security issue)
  // anymway I don't pass the original error object to client, here just for additional safety

  // if (err instanceof TokenTooOld) {
  //   console.log('AAAAAAAAAAAAA');
  // }

  if (res.headersSent) {
    // answer to client already done
    return;
  }

  // MongoNetworkError: cannot connect to database
  // MongoError: something wrong with the query, e.g. Family.find({ Date: { $last: 'Date' } });

  // if (error instanceof MongoError) {
  //   return res.status(503).json({
  //     type: 'MongoError',
  //     message: error.message
  //   });
  // }

  if (err.name === 'CastError') {
    // if session id gets corrupted, this deletes the cookie from client browser.
    req.session = null;
    req.logout;
    return res.sendStatus(500);
  }

  return res
    .status(err.statusCode || 500)
    .json({ frontEndData: err.frontEndData });

  // return res.sendStatus(err.status || 500);
};
