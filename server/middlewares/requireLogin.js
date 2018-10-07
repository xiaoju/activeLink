module.exports = (req, res, next) => {
  if (!req.user) {
    console.log('REJECTED login from ', req.ip);
    return res.status(401).send({ message: 'Please log in...' });
  }
  if (req.user) {
    console.log('GRANTED login from ', req.ip, ' for ', req.user.primaryEmail);
  }
  next();
};
