const router = require('express').Router();

router.get('/', (req, res) => {
  try {
    console.log('LOGGING OUT: ', req.user.primaryEmail);
    req.logout();
  } catch (error) {
    console.log('There was an error by logout: ', error);
  }
  // throw new Error('TEST error by /api/logout !!');
  res.redirect('/');
});

module.exports = router;
