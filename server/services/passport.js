const uuid = require('uuid/v4');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const Family = mongoose.model('families');
const FoundNoAccount = require('../errors/FoundNoAccount');
const WrongPassword = require('../errors/WrongPassword');
const wrapAsync = require('../utils/wrapAsync');
var bcrypt = require('bcrypt-nodejs');
const util = require('util');
const bcryptCompare = util.promisify(bcrypt.compare);

passport.serializeUser((family, done) => {
  if (!family.id) {
    done(err, null);
  } else {
    done(null, family.id);
  }
});

passport.deserializeUser((id, done) => {
  Family.findById(id)
    .then(family => {
      done(null, family);
    })
    .catch(error => {
      done(error);
    });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'primaryEmail',
      passwordField: 'password'
    },
    wrapAsync(async function(primaryEmail, candidatePassword, done) {
      if (primaryEmail) {
        primaryEmail = primaryEmail.toLowerCase();
      }

      const thisFamily = await Family.findOne({
        primaryEmail: primaryEmail
      });

      if (!thisFamily) {
        throw new FoundNoAccount();
      }

      const isMatch = await bcryptCompare(
        candidatePassword,
        thisFamily.password
      );

      if (isMatch) {
        return done(null, thisFamily);
      } else {
        throw new WrongPassword();
      }
    })
  )
);
