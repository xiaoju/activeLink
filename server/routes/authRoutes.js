const passport = require('passport');
const {
  // familyId,
  // allKids,
  eventId,
  allEvents,
  eventName,
  eventProviderName,
  eventContacts,
  allItems,
  // allParents,
  // familyMedia,
  // allRegistered,
  // registeredPerId,
  // paymentsHistory,
  standardPrices,
  discountedPrices,
  discountQualifiers,
  mandatoryItems,
  familyItems,
  // familyPerId,
  staffPerId,
  itemsPerId
} = require('../models/draftState');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // app.get(
  //   '/auth/github',
  //   passport.authenticate('github', { scope: ['user:email'] })
  // );

  // app.get(
  //   '/auth/local',
  //   passport.authenticate('local', { scope: ['user:email'] })
  // );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/register');
    }
  );

  // app.get(
  //   '/auth/github/callback',
  //   passport.authenticate('github'),
  //   (req, res) => {
  //     res.redirect('/dashboard');
  //   }
  // );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    // console.log('authRoute.js - req.user: ', req.user);
    // res.send(req.user);

    if (!req.user) {
      res.send(null);
    } else {
      res.send({
        profile: {
          _id: req.user._id,
          googleId: req.user.googleId,
          familyId: req.user.familyId,
          allKids: req.user.allKids,
          allParents: req.user.allParents,
          familyPerId: req.user.familyPerId,
          familyMedia: req.user.familyMedia,
          allRegistered: req.user.allRegistered, // TODO rename to allRegisteredItems
          registeredPerId: req.user.registeredPerId, // TODO rename to registeredItemsById
          paymentsHistory: req.user.paymentsHistory,
          allEvents: req.user.allEvents
        },
        eventsById: {
          e0: {
            // this all goes to the eventReducer
            eventId,
            eventName,
            eventProviderName,
            eventContacts,
            allItems,
            standardPrices,
            discountedPrices,
            discountQualifiers,
            mandatoryItems,
            familyItems,
            staffPerId,
            itemsPerId
          }
        }
      });
    }
  });
};
