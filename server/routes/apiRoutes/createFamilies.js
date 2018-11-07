const router = require('express').Router();
const requireLogin = require('../../middlewares/requireLogin');
const requireAdmin = require('../../middlewares/requireAdmin');
const wrapAsync = require('../../utils/wrapAsync');
const buildFamilies = require('../../utils/buildFamilies');

router.put(
  '/',
  requireLogin,
  requireAdmin,
  wrapAsync(async function(req, res) {
    const feedback = await buildFamilies(req);
    res.status(200).json(feedback);
  })
);

module.exports = router;
