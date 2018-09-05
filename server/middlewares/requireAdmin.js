module.exports = (req, res, next) => {
  const myAssoArray = req.user.roles.admin;
  // BUG the roles shouldn't be read from req! They should come from database,
  // otherwise it can be faked!

  if (!myAssoArray.includes('a0')) {
    console.log("you must be admin of 'a0'!");
    return res.status(403).send({
      error: 'Unauthorized!'
      // status: 403,
      // code: 1, // custom code that makes sense for your application
      // message: 'You are not a premium user',
      // moreInfo: 'https://myawesomeapi.io/upgrade'
    });
  } else {
    next();
  }
};

// function HasRole(role) {
//   return function(req, res, next) {
//     if (role !== req.user.role) res.redirect(...);
//     else next();
//   }
// }
