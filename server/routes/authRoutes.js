const passport = require('passport');
const {
  familyId,
  allKids,
  eventId,
  eventName,
  eventProviderName,
  eventContacts,
  allItems,
  allParents,
  familyMedia,
  allRegistered,
  registeredPerId,
  paymentsHistory,
  standardPrices,
  discountedPrices,
  discountQualifiers,
  mandatoryItems,
  familyItems,
  familyPerId,
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
      res.redirect('/registerEvent');
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
    console.log('authRoute.js - req.user: ', req.user);
    // res.send(req.user);

    if (!req.user) {
      res.send(null);
    } else {
      let { _id, googleId, credits } = req.user;
      res.send({
        _id,
        googleId,
        credits,
        familyId,
        allKids,
        eventId,
        eventName,
        eventProviderName,
        eventContacts,
        allItems,
        allParents,
        familyMedia,
        allRegistered,
        registeredPerId,
        paymentsHistory,
        standardPrices,
        discountedPrices,
        discountQualifiers,
        mandatoryItems,
        familyItems,
        familyPerId,
        staffPerId,
        itemsPerId
      });
    }
  });
};
