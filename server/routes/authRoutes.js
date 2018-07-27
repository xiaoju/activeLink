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

  // app.get(
  //   '/auth/google/callback',
  //   passport.authenticate('google'),
  //   (req, res) => {
  //     res.redirect('/register');
  //   }
  // );
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

  // app.get(
  //   '/auth/github/callback',
  //   passport.authenticate('github'),
  //   (req, res) => {
  //     res.redirect('/dashboard');
  //   }
  // );

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
