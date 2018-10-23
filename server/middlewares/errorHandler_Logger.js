module.exports = (err, req, res, next) => {
  console.log(
    req.ip,
    (req.user && req.user.primaryEmail) || (req.body && req.body.primaryEmail),
    req.originalUrl,
    err.statusCode,
    err.privateBackendMessage,
    err.stack
  );
  debugger;
  next(err);
};
