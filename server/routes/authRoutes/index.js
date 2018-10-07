const router = require('express').Router();

router
  .get('/', function(req, res) {
    // console.log('THIS IS /auth');
    res.status(200).send({ status: 'working' });
  })
  .use('/local', require('./LocalStrategy'))
  .use('/createResetToken', require('./createResetToken'))
  .use('/checkResetToken', require('./checkResetToken'))
  .use('/resetPassword', require('./resetPassword'));

module.exports = router;
