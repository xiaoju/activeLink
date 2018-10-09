module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.httpStatusCode).json({ err });
};
