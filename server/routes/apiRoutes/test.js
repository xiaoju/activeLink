const router = require('express').Router();

const requireLogin = require('../../middlewares/requireLogin');

router.get('/', requireLogin, async function(req, res) {
  try {
    console.log('req.session: ', req.session);
    res.status(201).json({
      reqSession: req.session
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
