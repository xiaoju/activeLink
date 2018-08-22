const passport = require('passport');

const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Family = mongoose.model('families');

var async = require('async'); // TODO remove this dependancy, using promises or `async await` instead
var crypto = require('crypto');

const keys = require('../config/keys');
// var Mailgun = require('mailgun-js');
// var mailgun = new Mailgun({
//   apiKey: keys.mailgunAPIKey,
//   domain: keys.mailgunDomain
// });
// console.log('ABC');
// console.log('keys.mailgunAPIKey: ', keys.mailgunAPIKey);
// console.log('keys.mailgunDomain: ', keys.mailgunDomain);
// var emailData = {
//   from: 'jerome@xiaoju.io',
//   to: 'jerome.clerambault@outlook.com',
//   subject: 'essai du compte mailgun',
//   html:
//     'bla bla bla, un email en html <a href="http://0.0.0.0:3030/validate?' +
//     'test@xiaoju.io' +
//     '">Click here to add your email address to a mailing list</a>'
// };

// var api_key = 'key-5788e11642dfd95bb68f58a0804513d1';
// var domain = 'xiaoju.io';
var mailgun = require('mailgun-js')({
  apiKey: keys.mailgunAPIKey,
  domain: keys.mailgunDomain
});

module.exports = app => {
  app.get('/auth/local', function(req, res) {
    console.log('SIMPLE REDIRECT FROM /auth/local to /login');
    res.redirect('/login');
  });

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

      // bypass login and just redirect
      // res.redirect('/lemonde');
      //
    })(req, res, next);
  });

  app.post('/auth/reset', function(req, res, next) {
    async.waterfall(
      [
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          Family.findOne({ primaryEmail: req.body.primaryEmail }, function(
            err,
            family
          ) {
            if (!family) {
              // req.flash('error', 'No account with that email address exists.');
              console.log('RESET ERROR: No account with that email address.');
              return res.redirect('/login');
            }

            family.resetPasswordToken = token;
            family.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            family.save(function(err) {
              done(err, token, family);
            });
          });
        },
        function(token, family, done) {
          const emailData = {
            from: 'The English Link <english-link@xiaoju.io>',
            to: 'jerome.clerambault@outlook.com',
            subject: 'English-Link / password reset',
            text:
              'Hello,\n\n' +
              'You are receiving this email because you (or someone else) has requested a password reset for your English Link account.\n\n' +
              'Please click on the following link, or paste it into your internet browser to complete the process:\n\n' +
              'http://' +
              req.headers.host +
              '/auth/reset/' +
              token +
              '\n\n' +
              'If you did not request a new password, please ignore this email and your password will remain unchanged.\n\n' +
              'Kind Regards,\n' +
              'Jerome'
          };

          mailgun.messages().send(emailData, function(error, body) {
            if (error) {
              console.log('ERROR by email sending: ', error);
            } else {
              console.log('An email has been sent.');

              // req.flash(
              //   'info',
              //   'An e-mail has been sent to ' +
              //     family.primaryEmail +
              //     " with further instructions. Don't forget to check you spam folder!"
              // );

              console.log('Body: ', body);
            }
          });

          res.redirect('/emailsent'); // TODO use flash messages instead
        }
      ],
      function(err) {
        if (err) return next(err);
        res.redirect('/login');
      }
    );
  });

  app.get('/auth/reset/:token', function(req, res) {
    Family.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      },
      function(err, family) {
        if (!family) {
          console.log('ERROR: Password reset token is invalid or has expired.');
          // req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/login'); // TODO pass the parameter 'resendPassword: true' to login
        }
        res.redirect('/reset/' + req.params.token);
      }
    );
  });

  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'), // complete the authenticate using the google strategy
    (err, req, res, next) => {
      // custom error handler to catch any errors, such as TokenError
      if (err.name === 'TokenError') {
        console.log('/auth/google/callback (GET) "tokenError": ', err);
        // the error when a Token has already been used/redeemed
        res.redirect('/auth/google'); // redirect them back to the login page
      } else {
        console.log('/auth/google/callback (GET) error: ', err); // Handle other errors here
      }
    },
    (req, res) => {
      // On success, redirect back to '/register'
      res.redirect('/register');
    }
  );

  app.get('/api/logout', (req, res) => {
    try {
      req.logout();
    } catch (error) {
      console.log('There was an error by logout: ', error);
    }
    // throw new Error('TEST error by /api/logout !!');
    res.redirect('/');
  });

  app.get('/api/current_family', async (req, res) => {
    let thisAsso;
    try {
      thisAsso = await Asso.findOne({ id: 'a0' });
    } catch (error) {
      console.log(
        "/api/current_family (get) error, couldn't access event in database ",
        error
      );
    }

    // Build `familyById` out of database records. It contains the detailed
    // information (firstName, familyName, kidGrade) for the kids and parents
    // belonging to this family.
    // Then send `familyById` to frontEnd
    // BUG if the family wasn't created yet, req.user is undefined
    // if (!req.user.allKids) {
    // TODO check the whole logic here!
    let familyById;
    let familyByIdArray;
    if (!req.user) {
      const familyById = {};
    } else {
      const allParentsAndKids = req.user.allKids.concat(req.user.allParents);
      try {
        familyByIdArray = await User.find({
          id: { $in: allParentsAndKids }
        });
      } catch (error) {
        console.log(
          'authRoutes.js, api/current_family (get), error by mongo search to build familyById: ',
          error
        );
      }
      // convert familyByIdArray [{...},{..}] to an object: {id:{...}, id:{...}}
      familyById = familyByIdArray.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
      }, {});
    }

    // put together the data required by client
    if (!req.user) {
      res.send(null);
      // if not logged in, don't send data.
    } else {
      // console.log('thisAsso: ', thisAsso);
      // console.log('thisAsso.name: ', thisAsso.name);
      // console.log('thisAsso.iconLink: ', thisAsso.iconLink); // BUG why is this undefined?!!
      res.send({
        profile: {
          familyById,
          _id: req.user._id,
          googleId: req.user.googleId, // TODO check do I need send this to frontend?
          familyId: req.user.familyId,
          allKids: req.user.allKids,
          allParents: req.user.allParents,
          familyMedia: req.user.familyMedia,
          addresses: req.user.addresses,
          registrations: req.user.registrations,
          // registeredById: req.user.registeredById, // TODO rename to registeredItemsById
          paymentReceipts: req.user.paymentReceipts,
          allEvents: req.user.allEvents
        },
        thisEvent: {
          // this goes to the eventReducer
          ...thisAsso.eventsById.e0,
          eventProviderName: thisAsso.name,
          assoIconLink: thisAsso.iconLink,
          itemsById: thisAsso.itemsById,
          address: thisAsso.address,
          allStaff: thisAsso.allStaff,
          staffById: thisAsso.staffById
        }
      });
    }
  });
};
