const router = require('express').Router();

router
  .get('/', function(req, res) {
    // console.log('THIS IS /auth');
    res.status(200).send({ status: 'working' });
  })
  .use('/local', require('./LocalStrategy'))
  .use('/checkResetToken/:token', require('./checkResetToken'))
  .use('/reset/:token', require('./reset_token'))
  .use('/reset', require('./reset'));

module.exports = router;
