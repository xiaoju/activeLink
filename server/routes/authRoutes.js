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
      res.redirect('/dashboard');
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
    // res.send(req.user);
    // console.log('req.user: ', req.user);
    res.send({
      _id: req.user._id,
      googleId: req.user.googleId, // is undefined!!
      credits: req.user.credits,
      req_user: req.user,
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
  });
};
