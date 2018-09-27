const router = require('express').Router();
const passport = require('passport');

router.get('/', async function(req, res) {
  console.log('SIMPLE REDIRECT FROM /auth/local to /login');
  res.redirect('/login');
});

router.post('/', passport.authenticate('local'), async function(req, res) {
  return res.json({
    authStatus: true
  });
});

module.exports = router;
