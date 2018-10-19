module.exports = (err, req, res, next) => {
  console.error(
    req.ip,
    req.user.primaryEmail,
    err.statusCode,
    err.privateBackendMessage,
    err.stack
  );
  next(err);
};
