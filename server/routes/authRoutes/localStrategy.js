const router = require('express').Router();
const passport = require('passport');

router.get('/', async function(req, res) {
  console.log('SIMPLE REDIRECT FROM /auth/local to /login');
  res.redirect('/login');
});

// router.post(
//   '/',
//   passport.authenticate('local')
//   // , async function(req, res) {return res.json({authStatus: true});}
// );

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.sendStatus(401);
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.sendStatus(200);
    });
  })(req, res, next);
});

module.exports = router;
