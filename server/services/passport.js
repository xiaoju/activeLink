const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GithubStrategy = require('passport-github2').Strategy;
// var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      } else {
        const newUser = await new User({
          googleId: profile.id
        }).save();
        done(null, newUser);
      }
    }
  )
);

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: keys.githubClientID,
//       clientSecret: keys.githubClientSecret,
//       callbackURL: '/auth/github/callback',
//       proxy: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const existingUser = await User.findOne({ githubId: profile.id });
//
//       if (existingUser) {
//         return done(null, existingUser);
//       } else {
//         const user = await new User({ githubId: profile.id }).save();
//         done(null, user);
//       }
//     }
//   )
// );

// passport.use(
//   'login',
//   new LocalStrategy(
//     {
//       passReqToCallback: true
//     },
//     function(req, username, password, done) {
//       // check in mongo if a user with username exists or not
//       User.findOne({ username: username }, function(err, user) {
//         // In case of any error, return using the done method
//         if (err) return done(err);
//         // Username does not exist, log error & redirect back
//         if (!user) {
//           console.log('User Not Found with username ' + username);
//           return done(null, false, req.flash('message', 'User Not found.'));
//         }
//         // User exists but wrong password, log the error
//         if (!isValidPassword(user, password)) {
//           console.log('Invalid Password');
//           return done(null, false, req.flash('message', 'Invalid Password'));
//         }
//         // User and password both match, return user from
//         // done method which will be treated like success
//         return done(null, user);
//       });
//     }
//   )
// );
