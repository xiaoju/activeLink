const router = require('express').Router();

router
  .get('/', function(req, res) {
    // console.log('THIS IS /api/v1');
    res.status(200).send({ name: 'activeLink', version: '1.0.0' });
  })
  .use('/logout', require('./logout'))
  .use('/current_family', require('./createFamilies'))
  .use('/payment', require('./payment'))
  .use('/dashboard', require('./dashboard'))
  .use('/rebuildregistrations', require('./rebuildRegistrations'))
  .use('/createFamilies', require('./createFamilies'))
  .use('/api/v1/updatemany', require('./updateMany'))
  .use('/dbdump', require('./dbdump'));

module.exports = router;
