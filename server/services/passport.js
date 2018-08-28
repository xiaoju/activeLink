const uuid = require('uuid4');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const Family = mongoose.model('families');

passport.serializeUser((family, done) => {
  done(null, family.id);
});

passport.deserializeUser((id, done) => {
  Family.findById(id).then(family => {
    done(null, family);
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
      let existingFamily;
      try {
        existingFamily = await Family.findOne({ googleId: profile.id });
      } catch (error) {
        console.log('passport.js, line 35 // error by findOne: ', error);
      }

      if (existingFamily) {
        return done(null, existingFamily);
      } else {
        const newFamily = await new Family({
          googleId: profile.id,
          familyId: uuid()
        }).save();
        done(null, newFamily);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'primaryEmail',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, primaryEmail, password, done) {
      if (primaryEmail) primaryEmail = primaryEmail.toLowerCase();

      process.nextTick(function() {
        Family.findOne({ primaryEmail: primaryEmail }, function(err, family) {
          if (err) return done(err);

          if (!family) {
            return done(
              null,
              false,
              // req.flash('loginMessage', 'No user found.')
              console.log('found no account with this email.')
            );
          }

          // if (!family.validPassword(password))
          //   return done(
          //     null,
          //     false,
          //     req.flash('loginMessage', 'Oops! Wrong password.')
          //   );
          // else
          //   // all is well, return user
          //   return done(null, user);

          family.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
              return done(null, family);
            } else {
              console.log('NO PWD MATCH');
              return done(null, false, { message: 'Incorrect password.' });
              // return done(null, family, { message: 'Incorrect password.' }); // bypass the password check!
            }
          });
        });
      });
    }
  )
);

// from the scotch tuto
// passport.use(
//   'local-login',
//   new LocalStrategy(
//     {
//       // by default, local strategy uses username and password, we will override with email
//       usernameField: 'email',
//       passwordField: 'password',
//       passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
//     },
//     function(req, email, password, done) {
//       if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
//
//       // asynchronous
//       process.nextTick(function() {
//         User.findOne({ 'local.email': email }, function(err, user) {
//           // if there are any errors, return the error
//           if (err) return done(err);
//
//           // if no user is found, return the message
//           if (!user)
//             return done(
//               null,
//               false,
//               req.flash('loginMessage', 'No user found.')
//             );
//
//           if (!user.validPassword(password))
//             return done(
//               null,
//               false,
//               req.flash('loginMessage', 'Oops! Wrong password.')
//             );
//           else
//             // all is well, return user
//             return done(null, user);
//         });
//       });
//     }
//   )
// );

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
