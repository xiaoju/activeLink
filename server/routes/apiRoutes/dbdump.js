const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
// const Registration = mongoose.model('registrations');
const requireLogin = require('../../middlewares/requireLogin');
const requireAdmin = require('../../middlewares/requireAdmin');
const requirePlatformAdmin = require('../../middlewares/requirePlatformAdmin');

// exports a full dump of the database in json format
router.get(
  '/',
  requireLogin,
  requireAdmin,
  // requirePlatformAdmin,
  async function(req, res) {
    let assos, families, users, dbDump;

    try {
      assos = await Asso.find({});
    } catch (err) {
      console.log('dbDump error (assos): ', err);
      assos = { failed: true, error: err.toString() };
    }

    try {
      families = await Family.find({});
    } catch (err) {
      console.log('dbDump error (families): ', err);
      families = { failed: true, error: err.toString() };
    }

    try {
      users = await User.find({});
    } catch (err) {
      console.log('dbDump error (users): ', err);
      users = { failed: true, error: err.toString() };
    }

    dbDump = { assos, families, users };
    // res.status(201).json({ assos, families, users });

    res.status(201).json({ dbDump });
  }
);

module.exports = router;
