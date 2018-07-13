const passport = require('passport');
// const { eventsById } = require('../models/draftState');

const mongoose = require('mongoose');
const Asso = mongoose.model('assos');

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

  app.get('/api/current_user', async (req, res) => {
    // console.log('authRoute.js - req.user: ', req.user);
    // res.send(req.user);

    let thisAsso;
    try {
      thisAsso = await Asso.findOne({ id: 'a0' });
    } catch (error) {
      console.log(
        "/api/current_user (get) error, couldn't access event in database ",
        error
      );
    }
    // console.log('authRoutes (get), thisAsso: ', thisAsso);

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
          familyById: req.user.familyById,
          familyMedia: req.user.familyMedia,
          allRegistered: req.user.allRegistered, // TODO rename to allRegisteredItems
          registeredById: req.user.registeredById, // TODO rename to registeredItemsById
          paymentReceipts: req.user.paymentReceipts,
          allEvents: req.user.allEvents
        },
        thisEvent: {
          // this goes to the eventReducer
          ...thisAsso.eventsById.e0,
          eventProviderName: thisAsso.name,
          itemsById: thisAsso.itemsById,
          assoAdress: thisAsso.assoAdress,
          allStaff: thisAsso.allStaff,
          staffById: thisAsso.staffById
        }
      });
    }
  });
};
