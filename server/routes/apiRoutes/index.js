const router = require('express').Router();

router
  .get('/', function(req, res) {
    // This is `/api/v1`
    res.status(200).send({ name: 'activeLink', version: '1.0.0' });
  })
  .use('/logout', require('./logout'))
  .use('/current_family', require('./currentFamily'))
  .use('/payment', require('./payment'))
  .use('/dashboard', require('./dashboard'))
  .use('/rebuildregistrations', require('./rebuildRegistrations'))
  .use('/createFamilies', require('./createFamilies'))
  .use('/api/v1/updatemany', require('./updateMany'))
  .use('/dbdump', require('./dbdump'))
  .use('/test', require('./test'));

module.exports = router;
