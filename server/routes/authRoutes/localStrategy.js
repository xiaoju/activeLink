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
  // console.log('handle POST');
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log('localStrategy.js, ERROR: ', err);
      return next(err);
    }
    if (!user) {
      // console.log('localStrategy, no user');
      res.status(401).json(info);
      // console.log('BBB');
      return;
      // console.log('CCC');
    }
    // console.log('DDD');
    req.logIn(user, function(err) {
      if (err) {
        console.log('localStrategy, logIn(), ERROR: ', err);
        return next(err);
      }
      res.status(200).json(info);
    });
  })(req, res, next);
});

module.exports = router;
