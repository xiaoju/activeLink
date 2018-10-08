const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Family = mongoose.model('families');

router.get('/:token', async function(req, res) {
  let family;

  try {
    family = await Family.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
  } catch (err) {
    console.log('FAILED database lookup by checkResetToken ROUTE');
    return res.sendStatus(500);
  }

  if (!family) {
    // just logging who got problems
    let failed;
    try {
      failed = await Family.findOne({
        resetPasswordToken: req.params.token
      });
    } catch (err) {
      console.log('FAILED database lookup 2 by checkResetToken ROUTE');
      // but still sending status code 401 to client
    }
    if (!failed) {
      console.log(
        req.ip,
        ', ',
        req.user && req.user.primaryEmail,
        ': FAILED TOKEN CHECK (token not found)'
      );
    } else {
      console.log(
        req.ip,
        ', ',
        failed.primaryEmail,
        ': FAILED TOKEN CHECK (token too old)'
      );
    }
    // end of 'logging who got problems'
    return res.sendStatus(401);
  } else {
    console.log(req.ip, ', ', family.primaryEmail, ': CLICKED the reset link');
    return res.sendStatus(200);
  }
});

module.exports = router;
