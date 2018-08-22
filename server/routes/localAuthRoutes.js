const passport = require('passport');

const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');

module.exports = app => {
  // app.get('/auth/local', function(req, res) {
  //   res.render('login2', {
  //     user: req.user
  //   });
  // });

  app.get('/auth/local', function(req, res) {
    console.log('F');
    res.redirect('/login');
  });

  // app.get(
  //   '/auth/local',
  //   passport.authenticate('local', { scope: ['user:primaryEmail'] })
  // );

  app.post('/auth/local', function(req, res, next) {
    console.log('AUTH/LOCAL, POST');
    console.log('req.body:', req.body);
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        console.log('ERROR: ', err);
        return next(err);
      }

      if (!user) {
        console.log('NO USER, REDIRECT TO /sorry');
        return res.redirect('/sorry');
      }

      req.logIn(user, function(err) {
        console.log('USER FOUND: ', user);
        if (err) {
          console.log('ERROR (BUT USER FOUND): ', err);
          return next(err);
        }
        console.log('SUCCESS: REDIRECT TO /register');
        // On success, redirect back to '/register'
        return res.redirect('/register');
      });
    })(req, res, next);
  });
};
