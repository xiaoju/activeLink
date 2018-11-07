const router = require('express').Router();
const requireLogin = require('../../middlewares/requireLogin');
const requireAdmin = require('../../middlewares/requireAdmin');
const wrapAsync = require('../../utils/wrapAsync');
const buildDashboardData = require('../../utils/buildDashboardData');

router.get(
  '/',
  requireLogin,
  requireAdmin,
  wrapAsync(async function(req, res) {
    const dashboardData = await buildDashboardData();
    res.status(201).json(dashboardData);
  })
);

module.exports = router;
