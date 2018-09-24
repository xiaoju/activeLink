const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Registration = mongoose.model('registrations');
const requireLogin = require('../middlewares/requireLogin');
const requireAdmin = require('../middlewares/requireAdmin');
const requirePlatformAdmin = require('../middlewares/requirePlatformAdmin');

module.exports = app => {
  app.put('/api/v1/updatemany', requireLogin, requireAdmin, async function(
    req,
    res
  ) {
    const myAssoArray = req.user.roles.admin;
    const frontEndselectedAsso = req.body.selectedAsso;
    const frontEndselectedEvent = req.body.selectedEvent;
    const body = req.body;

    const f1 = req.body[0];
    console.log('req.body: ', req.body);
    console.log('f1: ', f1);
    console.log('frontEndselectedEvent: ', frontEndselectedEvent);
    console.log('frontEndselectedAsso: ', frontEndselectedAsso);

    res.status(201).json({
      hello: 'hello'
    });
  });
};
