const requireLogin = require('../middlewares/requireLogin');
// const data = require('../models/dummyData').data;
const data = require('../models/draftState');
// const items = require('../models/dummyData').items;

module.exports = app => {
  app.get('/api/data', requireLogin, (req, res) => {
    res.send({ data });
  });
};
