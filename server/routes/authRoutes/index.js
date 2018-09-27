var express = require('express');
var router = express.Router();

var LocalStrategyRoute = require('./LocalStrategy');
var checkResetTokenRoute = require('./checkResetToken');
var resetRoute = require('./reset');
var reset_tokenRoute = require('./reset_token');

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
