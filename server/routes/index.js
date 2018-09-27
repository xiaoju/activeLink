const router = require('express').Router();
const authRoute = require('./authRoutes');
const apiRoute = require('./apiRoutes');

router
  // .get('/', (req, res) => {
  //   console.log("This is the '/' route");
  //   res.status(200).json({ status: 'connected' });
  // })
  .use('/api/v1', apiRoute)
  .use('/auth', authRoute);

module.exports = router;
