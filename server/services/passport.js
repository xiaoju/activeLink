const uuid = require('uuid/v4');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const Family = mongoose.model('families');
const FoundNoAccount = require('../errors/FoundNoAccount');
const WrongPassword = require('../errors/WrongPassword');
const wrapAsync = require('../utils/wrapAsync');
var bcrypt = require('bcrypt');
const util = require('util');

passport.serializeUser((family, done) => {
  if (!family.id) {
    throw new FoundNoAccount('by serializeUser');
  } else {
    done(null, family.id);
  }
});

passport.deserializeUser(
  wrapAsync(async (req, id, done) => {
    const thisFamily = await Family.findById(id);
    if (!thisFamily) {
      throw new FoundNoAccount('by deserializeUser');
    }
    done(null, thisFamily);
  })
);

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
      const isMatch = await bcrypt.compare(
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
