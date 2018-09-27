var express = require('express');
var router = express.Router();

var createFamiliesRoute = require('./createFamilies');
var currentFamilyRoute = require('./currentFamily');
var dashboardRoute = require('./dashboard');
var dbdumpRoute = require('./dbdump');
var logoutRoute = require('./logout');
var paymentRoute = require('./payment');
var rebuildregistrationsRoute = require('./rebuildRegistrations');
var updateManyRoute = require('./updateMany');

router
  .get('/', function(req, res) {
    console.log('THIS IS /api/v1');
    res.status(200).send({ apiName: 'activeLink', version: '1.0.0' });
  })
  .use('/logout', logoutRoute)
  .use('/current_family', currentFamilyRoute)
  .use('/payment', paymentRoute)
  .use('/dashboard', dashboardRoute)
  .use('/rebuildregistrations', rebuildregistrationsRoute)
  .use('/createFamilies', createFamiliesRoute)
  .use('/api/v1/updatemany', updateManyRoute)
  .use('/dbdump', dbdumpRoute);

module.exports = router;
