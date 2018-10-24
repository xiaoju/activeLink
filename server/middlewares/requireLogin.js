const NotLoggedIn = require('../errors/NotLoggedIn');

module.exports = (req, res, next) => {
  if (!req.user) {
    throw new NotLoggedIn();
  } else {
    console.log(
      req.ip,
      req.user.primaryEmail,
      req.originalUrl,
      'GRANTED USER access'
    );
  }
  next();
};
