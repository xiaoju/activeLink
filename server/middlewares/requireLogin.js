module.exports = (req, res, next) => {
  if (!req.user) {
    console.log('you must log in!');
    return res.status(401).send({ error: 'You must log in!' });
  }
  next();
};
