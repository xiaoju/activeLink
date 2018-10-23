module.exports = (req, res, next) => {
  if (!req.user) {
    console.log(req.ip, req.originalUrl, 'REJECTED USER access');
    return res.sendStatus(401);
  }
  if (req.user) {
    console.log(
      req.ip,
      req.user.primaryEmail,
      req.originalUrl,
      'GRANTED USER access'
    );
  }
  next();
};
