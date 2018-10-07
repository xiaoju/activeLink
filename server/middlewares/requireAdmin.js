module.exports = (req, res, next) => {
  const myAssoArray = req.user.roles.admin;

  if (!myAssoArray || !myAssoArray.includes('a0')) {
    console.log(
      'REQUIRE_ADMIN REJECTED the connection to ',
      req.user.primaryEmail,
      ' for asso ',
      'a0',
      ' from ',
      req.ip
    );
    return res.status(403).send({
      error: 'Unauthorized!'
      // status: 403,
      // code: 1, // custom code that makes sense for your application
      // message: 'You are not a premium user',
      // moreInfo: 'https://myawesomeapi.io/upgrade'
    });
  } else {
    console.log(
      'REQUIRE_ADMIN GRANTED ',
      req.user.primaryEmail,
      ' for asso ',
      'a0',
      ' from ',
      req.ip
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
