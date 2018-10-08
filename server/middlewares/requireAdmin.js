module.exports = (req, res, next) => {
  const myAssoArray = req.user.roles.admin;

  if (!myAssoArray || !myAssoArray.includes('a0')) {
    console.log(
      req.ip,
      ', ',
      req.user.primaryEmail,
      ': REJECTED ADMIN access to ',
      req.originalUrl,
      ' of asso ',
      'a0'
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
      req.ip,
      ', ',
      req.user.primaryEmail,
      ': GRANTED ADMIN access to ',
      req.originalUrl
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
