var express = require('express');
var router = express.Router();

var LocalStrategyRoute = require('./authRoutes/LocalStrategyRoute');
var checkResetTokenRoute = require('./authRoutes/checkResetTokenRoute');
var resetRoute = require('./authRoutes/resetRoute');
var reset_tokenRoute = require('./authRoutes/reset_tokenRoute');

router
  .get('/', function(req, res) {
    console.log('THIS IS /auth');
    res.status(200).send({ status: 'working' });
  })
  .use('/local', LocalStrategyRoute)
  .use('/reset', resetRoute)
  .use('/checkResetToken/:token', checkResetTokenRoute)
  .use('/reset/:token', reset_tokenRoute);

module.exports = router;
