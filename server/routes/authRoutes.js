const passport = require('passport');

const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');

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

  app.get('/api/current_family', async (req, res) => {
    // console.log(
    //   'authRoute.js is handling the request - req.user: ',
    //   req.user
    // );
    // res.send(req.user);
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
    if (!req.user) {
      const familyById = {};
    } else {
      const allParentsAndKids = req.user.allKids.concat(req.user.allParents);

      // const allParentsAndKids = req.user.allKids.concat(req.user.allParents);
      const familyByIdArray = await User.find({
        id: { $in: allParentsAndKids }
      });
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
      res.send({
        profile: {
          familyById,
          _id: req.user._id,
          googleId: req.user.googleId, // TODO check do I need send this to frontend?
          familyId: req.user.familyId,
          allKids: req.user.allKids,
          allParents: req.user.allParents,
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
