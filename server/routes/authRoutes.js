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
      // openEvents  // events currently open for registration
      //   .map((eventId)=>(!allRegistered.includes(eventId))) // that user hasn't registered yet
      //   .map(eventId=> ...eventObject(eventId)... )   // [pseudo code] pull the event information from database
      //   .reduce(  gather all the objects into one    )    // useful only if someday several events at same time!
      //         // { e0: {}, e1: {}, e2: {} }
      // let { _id, googleId } = req.user;
      res.send({
        _id: req.user._id,
        googleId: req.user.googleId,
        familyId,
        allKids,
        // eventsById: {e0: {id, name, providerName, ...}, e1: {...}, e2: {...}}
        // allEvents,  // ['e0', 'e1', 'e2']
        //  These are the events currently open for registration, and
        // not registered yet by this user
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
