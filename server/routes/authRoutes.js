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
    let emailTo;
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
          emailTo =
            process.env.NODE_ENV === 'production' && !process.env.SILENT
              ? family.primaryEmail
              : 'dev@xiaoju.io';

          const emailData = {
            from: 'The English Link <english-link@xiaoju.io>',
            to: emailTo,
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
                'The link http://' +
                  req.headers.host +
                  '/reset/' +
                  token +
                  ' for ' +
                  family.primaryEmail +
                  ' has been sent to ' +
                  emailTo
              );
              return res.json({
                resetTokenEmailSent: true,
                emailedTo: emailTo,
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
    let emailTo;
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
          emailTo =
            process.env.NODE_ENV === 'production' && !process.env.SILENT
              ? family.primaryEmail
              : 'dev@xiaoju.io';

          const emailData = {
            from: 'The English Link <english-link@xiaoju.io>',
            to: emailTo,
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
    let theseAssos; // all asso details for the assos where this family is a parent.
    // Obtained from database, find in assos collection the documents that match
    // the IDs listed in req.user.roles.parent
    // [{'id': 'a0', ...}, {'id': 'a1', ...}, ...]

    // but for now, only one asso...
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

    // for now, only one asso...
    theseAssos = [thisAsso];

    // normalize theseAssos for redux:
    let assosById = theseAssos.reduce(function(obj, thisAsso) {
      obj[thisAsso.id] = thisAsso;
      return obj;
    }, {});
    // for one asso, we simply get: AssosById = {a0: {id: 'a0', ...}}

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // build familyRegistrations out of `registrations` from assos collection
    // (actually similar code when building the orderReceipt in `billingRoutes`)
    let familyRegistrations;
    if (!req.user) {
      familyRegistrations = [];
    } else {
      const familyId = req.user.familyId;
      const allKids = req.user.allKids;
      const allParents = req.user.allParents;
      const allKidsAndParents = [].concat(allKids, allParents);
      const allKidsFamilyParents = [familyId].concat(allKidsAndParents);
      familyRegistrations = allKidsFamilyParents.map(userId => ({
        [userId]: thisAsso.registrations[userId]
      }));
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // for each asso of this family
    const assoEvents = thisAsso.assoEvents;
    // next 3 to be obtained, in frontEnd, from assoEvents and eventsById based on current date vs
    // (for each event) registrationStart and registrationEnd,
    // through assoEvents.filter()
    const currentRegistrationEvents = ['e0'];
    // TODO don't hardcoded!
    const pastRegistrationEvents = [''];
    const futureRegistrationEvents = [''];

    // the assos of this family:
    // familyAssos = req.user.roles.parents;

    // the events of this familyId:
    // familyEvents = familyAssos.map(assoId => .assoEvents)

    // const familyEvents = {
    //   currentRegistrationEvents,
    //   pastRegistrationEvents,
    //   futureRegistrationEvents
    // }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // extract the events details from database
    // and format to normalized redux object

    // // allEvents will be built by frontend, putting together past, current and
    // // future events from all his associations, as required
    // let allEvents = [
    //   ...new Set(
    //     [].concat(
    //       thisAsso.pastRegistrationEvents,
    //       thisAsso.currentRegistrationEvents,
    //       thisAsso.futureRegistrationEvents
    //     )
    //   )
    // ];

    // currently, only one asso. So we take all the events from the database without filtering
    let eventsById = thisAsso.eventsById;
    // when several assos, we will extract from events collection all the events
    // that match our associations
    // Then we will convert from array to normalized redux object:
    // let eventsById = ourAssosEvents.reduce(function(obj, eventId) {
    //   obj[eventId] = theseEvents[eventId];
    //   return obj;
    // }, {});

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // put together the data required by client, and send it
    if (!req.user) {
      // res.status(401).send(null);
      // console.log('authroutes.js, row 258, send(null)');
      res.send(null); // if not logged in, don't send data.
    } else {
      // let thisEvent = req.user.registeredEvents.includes('e0')
      //   ? null // send null if there is no event opened for registration
      //   : thisAsso.eventsById.e0;
      //
      // let openEvents = req.user.registeredEvents.includes('e0') ? [] : ['e0'];

      res.status(200).send({
        assos: {
          assosById,
          allAssos: req.user.roles.parent
        },
        asso: {
          id: thisAsso.id,
          contacts: thisAsso.contacts,
          eventProviderName: thisAsso.name,
          paymentPreferences: thisAsso.paymentPreferences,
          replyTo: thisAsso.replyTo,
          assoEmail: thisAsso.assoEmail,
          allItems: thisAsso.allItems,
          itemsById: thisAsso.itemsById,
          address: thisAsso.address,
          allStaff: thisAsso.allStaff,
          staffById: thisAsso.staffById
        },
        profile: {
          familyById,
          familyId: req.user.familyId,
          primaryEmail: req.user.primaryEmail,
          photoConsent: req.user.photoConsent,
          roles: req.user.roles,
          allKids: req.user.allKids,
          allParents: req.user.allParents,
          familyMedia: req.user.familyMedia,
          addresses: req.user.addresses,
          paymentReceipts: req.user.paymentReceipts,
          allEvents: req.user.allEvents,
          registeredEvents: req.user.registeredEvents,
          familyRegistrations
        },
        events: {
          eventsById,
          currentRegistrationEvents,
          pastRegistrationEvents,
          futureRegistrationEvents
        }
      });
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  });
};
