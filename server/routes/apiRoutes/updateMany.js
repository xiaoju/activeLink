const router = require('express').Router();
const requireLogin = require('../../middlewares/requireLogin');
const requireAdmin = require('../../middlewares/requireAdmin');

router.put('/', requireLogin, requireAdmin, async function(req, res) {
  const myAssoArray = req.user.roles.admin;
  const frontEndselectedAsso = req.body.selectedAsso;
  const frontEndselectedEvent = req.body.selectedEvent;
  const body = req.body;

  const f1 = req.body[0];
  console.log('req.body: ', req.body);
  console.log('f1: ', f1);
  console.log('frontEndselectedEvent: ', frontEndselectedEvent);
  console.log('frontEndselectedAsso: ', frontEndselectedAsso);

  res.status(201).json({
    hello: 'hello'
  });
});

module.exports = router;
