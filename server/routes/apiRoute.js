var express = require('express');
var router = express.Router();

var dashboardRoute = require('./apiRoutes/dashboard');
var rebuildregistrationsRoute = require('./apiRoutes/rebuildRegistrations');
var dbdumpRoute = require('./apiRoutes/dbdump');
var createFamiliesRoute = require('./apiRoutes/createFamilies');
var logoutRoute = require('./apiRoutes/logout');
var currentFamilyRoute = require('./apiRoutes/currentFamily');
var updateManyRoute = require('./apiRoutes/updateMany');
var paymentRoute = require('./apiRoutes/payment');

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
