module.exports = (err, req, res, next) => {
  console.log(
    req.ip || '[ip]',
    (req.user && req.user.primaryEmail) ||
      (req.body && req.body.primaryEmail) ||
      '[email]',
    req.originalUrl || '[URL]',
    err.statusCode || '[statusCode]',
    err.privateBackendMessage || '[privateBackendMessage]',
    err.errorLabels || '[errorLabels]',
    err.name || '[name]',
    err.stack || '[stack]'
  );
  next(err);
};
