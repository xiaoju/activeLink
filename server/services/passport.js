const uuid = require('uuid/v4');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const Family = mongoose.model('families');

passport.serializeUser((family, done) => {
  console.log('serializeUser(), family.primaryEmail: ', family.primaryEmail);
  done(null, family.id);
});

passport.deserializeUser((id, done) => {
  Family.findById(id).then(family => {
    console.log(
      'just did deserializeUser(), family.primaryEmail: ',
      family.primaryEmail
    );
    done(null, family);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'primaryEmail',
      passwordField: 'password'
      // passReqToCallback: true // TODO remove this and `req` in the function
      // below, as req was only used for flash messages
    },
    function(
      // req,
      primaryEmail,
      password,
      done
    ) {
      if (primaryEmail) primaryEmail = primaryEmail.toLowerCase();
      // TODO careful that not 2 different accounts can be created, with
      // different cases, but pointing to same email address

      process.nextTick(function() {
        Family.findOne({ primaryEmail: primaryEmail }, function(err, family) {
          if (err) {
            console.log('AUTH ERROR by: ', primaryEmail);
            return done(err);
          }

          if (family) {
            console.log(
              'PASSPORT.JS did find a family with this email (family.primaryEmail): ',
              family.primaryEmail
            );
          }

          if (!family) {
            console.log('FOUND NO ACCOUNT for: ', primaryEmail);
            return done(null, false, {
              message:
                'No known account for this email. ' +
                'Please try again, or contact dev@xiaoju.io for support.'
            });
          }

          family.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
              console.log('JUST LOGGED IN: ', primaryEmail);
              return done(null, family, { message: 'pwd_did_match' });
            } else {
              console.log('NO PWD MATCH for: ', primaryEmail);
              return done(null, false, {
                message:
                  'Wrong password. ' +
                  'Please try again, or contact dev@xiaoju.io for support.'
              });
            }
          });
        });
      });
    }
  )
);
