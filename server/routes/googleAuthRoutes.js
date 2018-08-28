const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // app.get(
  //   '/auth/google/callback',
  //   passport.authenticate('google'), // complete the authenticate using the google strategy
  //   (err, req, res, next) => {
  //     // custom error handler to catch any errors, such as TokenError
  //     if (err.name === 'TokenError') {
  //       console.log('/auth/google/callback (GET) "tokenError": ', err);
  //       // the error when a Token has already been used/redeemed
  //       res.redirect('/auth/google'); // redirect them back to the login page
  //     } else {
  //       console.log('/auth/google/callback (GET) error: ', err); // Handle other errors here
  //     }
  //   },
  //   (req, res) => {
  //     // On success, redirect back to '/register'
  //     res.redirect('/register');
  //   }
  // );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/register',
      failureRedirect: '/login'
    })
  );
};
