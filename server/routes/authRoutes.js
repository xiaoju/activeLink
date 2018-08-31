const passport = require('passport');
const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Family = mongoose.model('families');
var async = require('async'); // TODO remove this dependancy, using promises or `async await` instead
var crypto = require('crypto');
const keys = require('../config/keys');
var mailgun = require('mailgun-js')({
  apiKey: keys.mailgunAPIKey,
  domain: keys.mailgunDomain
});

// // example of error catching:
// app.get('/User', async function(req, res) {
//   let users;
//   try {
//     users = await db.collection('User').find().toArray();
//   } catch (error) {
//     res.status(500).json({ error: error.toString() });
//   }
//   res.json({ users });
// });

module.exports = app => {
  app.get('/auth/local', function(req, res) {
    console.log('SIMPLE REDIRECT FROM /auth/local to /login');
    res.redirect('/login');
  });

  app.post('/auth/local', passport.authenticate('local'), function(req, res) {
    return res.json({
      authStatus: true
    });
  });

  // app.post('/auth/reset', function(req, res, next) {
  app.post('/auth/reset', function(req, res) {
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
              return res.json({
                resetTokenEmailSent: false,
                error: 'No account with that email address.'
              });
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
            to: family.primaryEmail,
            'h:Reply-To': 'englishlink31@gmail.com',
            subject: 'English-Link / password reset link',
            text:
              'Hello,\n\n' +
              'You are receiving this email because you (or someone else) has requested a password reset for your English Link account.\n\n' +
              'Please click on the following link, or paste it into your internet browser to complete the process:\n\n' +
              'http://' +
              req.headers.host +
              '/reset/' +
              token +
              '\n\n' +
              'If you did not request a new password, please ignore this email and your password will remain unchanged.\n\n' +
              'Kind Regards,\n' +
              'Jerome'
          };
          mailgun.messages().send(emailData, function(error, body) {
            if (error) {
              console.log('ERROR by email sending: ', error);
              return res.json({
                resetTokenEmailSent: false,
                error
              });
            } else {
              console.log(
                'The link has been sent: http://' +
                  req.headers.host +
                  '/reset/' +
                  token
              );
              return res.json({
                resetTokenEmailSent: true,
                emailedTo: family.primaryEmail,
                body
              });
            }
          });
        }
      ]
      // , function(err) {
      // if (err) return next(err);
      // return res.json({ resetTokenEmailSent: false, error });
      // }
    );
  });

  app.get('/auth/checkResetToken/:token', function(req, res) {
    Family.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      },
      function(error, family) {
        // TODO handle error
        if (!family) {
          return res.json({ tokenIsValid: false });
        }
        return res.json({ tokenIsValid: true });
      }
    );
  });

  app.post('/auth/reset/:token', function(req, res) {
    async.waterfall(
      [
        function(done) {
          Family.findOne(
            {
              resetPasswordToken: req.params.token,
              resetPasswordExpires: { $gt: Date.now() }
            },
            function(error, family) {
              if (!family) {
                return res.status(500).json({
                  passwordWasChanged: false,
                  error: 'Password reset token is invalid or has expired.'
                });
              }

              family.password = req.body.password;
              family.resetPasswordToken = undefined;
              family.resetPasswordExpires = undefined;

              family.save(function(error) {
                req.logIn(family, function(error) {
                  done(error, family);
                });
              });
            }
          );
        },
        function(family, done) {
          const emailData = {
            from: 'The English Link <english-link@xiaoju.io>',
            to: family.primaryEmail,
            'h:Reply-To': 'englishlink31@gmail.com',
            subject: 'English-Link / your password has been changed',
            text:
              'Hello,\n\n' +
              'the password has just been changed for your English-Link account ' +
              family.primaryEmail +
              '\n\n' +
              'Kind Regards,\n' +
              'Jerome'
          };
          mailgun.messages().send(emailData, function(error, body) {
            if (error) {
              return res.status(500).json({
                passwordWasChanged: false,
                error
              });
            } else {
              return res.status(200).json({
                passwordWasChanged: true,
                body
              });
            }
          });
          // TODO message to show on next page: 'Success! Your password has been changed.'
        }
      ],
      function(error) {
        // res.redirect('/');
        return res.json({
          passwordWasChanged: false,
          error
        });
      }
    );
  });

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
      res.status(500).json({ error: error.toString() });
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
      // res.status(401).send(null);
      // console.log('authroutes.js, row 258, send(null)');
      res.send(null);
      // if not logged in, don't send data.
    } else {
      let thisEvent = req.user.registeredEvents.includes('e0')
        ? null // send null if there is no event opened for registration
        : // TODO check the event dates to see if event is open for registration
          // and also look at list of events already registered by this user.
          {
            ...thisAsso.eventsById.e0,
            eventProviderName: thisAsso.name,
            assoEmail: thisAsso.assoEmail,
            replyTo: thisAsso.replyTo,
            emailFrom: thisAsso.emailFrom,
            itemsById: thisAsso.itemsById,
            address: thisAsso.address,
            allStaff: thisAsso.allStaff,
            staffById: thisAsso.staffById
          };

      let openEvents = req.user.registeredEvents.includes('e0') ? [] : ['e0'];
      // TODO don't hardcode the eventId!

      console.log('req.user.registrations', req.user.registrations);

      res.status(200).send({
        // asso: {
        //   eventProviderName: thisAsso.name,
        //   replyTo: thisAsso.replyTo,
        //   emailFrom: thisAsso.emailFrom,
        //   itemsById: thisAsso.itemsById,
        //   address: thisAsso.address,
        //   allStaff: thisAsso.allStaff,
        //   staffById: thisAsso.staffById
        // },
        profile: {
          familyById,
          _id: req.user._id, // OK to remove?
          // googleId: req.user.googleId,
          familyId: req.user.familyId,
          primaryEmail: req.user.primaryEmail,
          photoConsent: req.user.photoConsent,
          admin: req.user.admin,
          allKids: req.user.allKids,
          allParents: req.user.allParents,
          familyMedia: req.user.familyMedia,
          addresses: req.user.addresses,
          registrations: req.user.registrations, // TODO not received by frontend!
          paymentReceipts: req.user.paymentReceipts,
          allEvents: req.user.allEvents,
          registeredEvents: req.user.registeredEvents
        },
        thisEvent, // this goes to the eventReducer
        openEvents // not yet processed by the frontend
      });
    }
  });
};
