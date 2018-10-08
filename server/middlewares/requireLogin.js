module.exports = (req, res, next) => {
  if (!req.user) {
    console.log(req.ip, ': REJECTED logged-in access to ', req.originalUrl);
    return res.status(401).send({ message: 'Please log in...' });
  }
  if (req.user) {
    console.log(
      req.ip,
      ', ',
      req.user.primaryEmail,
      ': GRANTED logged-in access to ',
      req.originalUrl
    );
  }
  next();
};
