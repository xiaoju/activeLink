const requireLogin = require('../middlewares/requireLogin');
const events = require('../models/dummyData').events;

module.exports = app => {
  app.get('/api/events', requireLogin, (req, res) => {
    res.send({ events });
  });
};
