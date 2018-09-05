// this credential is required to:
// - create a new asso
// - access data from any asso
module.exports = (req, res, next) => {
  if (!req.user.roles.platform.includes('admin')) {
    console.log('401: you must me a platformMaster!');
    return res.status(401).send({ error: 'Unauthorized!' });
  }
  next();
};
