const NotAdmin = require('../errors/NotAdmin');

module.exports = (req, res, next) => {
  const myAssoArray = req.user.roles.admin;

  if (!myAssoArray || !myAssoArray.includes('a0')) {
    throw new NotAdmin();
  } else {
    console.log(
      req.ip,
      req.user.primaryEmail,
      req.originalUrl,
      'GRANTED ADMIN access'
    );
    next();
  }
};

// function HasRole(role) {
//   return function(req, res, next) {
//     if (role !== req.user.role) res.redirect(...);
//     else next();
//   }
// }
