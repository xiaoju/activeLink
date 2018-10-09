module.exports = (err, req, res, next) => {
  console.error(
    'LOGGER',
    req.ip,
    req.body.primaryEmail,
    err.httpStatusCode,
    err.stack
  );
  next(err);
};
