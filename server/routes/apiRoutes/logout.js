const router = require('express').Router();

router.get('/', (req, res) => {
  try {
    console.log(req.ip, ', ', req.user.primaryEmail, ': LOGGING OUT');
    req.logout();
  } catch (error) {
    console.log(
      req.ip,
      ', ',
      req.user.primaryEmail,
      ': ERROR by logout: ',
      error
    );
  }
  // throw new Error('TEST error by /api/logout !!');
  res.redirect('/');
});

module.exports = router;
