const router = require('express').Router();
const requireLogin = require('../../middlewares/requireLogin');
const wrapAsync = require('../../utils/wrapAsync');
const buildCurrentFamily = require('../../utils/buildCurrentFamily');

router.get(
  '/',
  requireLogin,
  wrapAsync(async (req, res) => {
    const currentFamily = await buildCurrentFamily(req);
    return res.status(200).json(currentFamily);
  })
);

module.exports = router;
