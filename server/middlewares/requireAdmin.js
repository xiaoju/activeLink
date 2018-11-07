const NotAdmin = require('../errors/NotAdmin');

module.exports = (req, res, next) => {
  const myAssoArray = req.user.roles.admin; // the assos for which this user got admin rights
  const selectedAsso = req.body.selectedAsso || 'a0'; // the asso for which admin work is requested
  // TODO don't hardcoded a0
  if (!myAssoArray || !myAssoArray.includes(selectedAsso)) {
    throw new NotAdmin(req.body.selectedAsso);
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
