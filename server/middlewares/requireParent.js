module.exports = (req, res, next) => {
  if (!req.user.roles.a0.includes('parent')) {
    console.log("401: you must be a parent in 'ao'");
    return res.status(401).send({ error: 'Unauthorized!' });
  }
  next();
};
