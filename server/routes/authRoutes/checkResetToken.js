const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Family = mongoose.model('families');

router.get('/:token', async function(req, res) {
  console.log('ROUTE checkResetToken.js, req.params.token: ', req.params.token);
  Family.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(error, family) {
      if (!family) {
        console.log('FAILED TOKEN CHECK by somebody');
        // TODO search again for the family, but without the {$gt: Date.now()}
        // constraint, so I can log who got a problem
        // TODO and use promises instead of callbacks!
        return res.sendStatus(401);
      }
      console.log('CLICKED the reset link: ', family.primaryEmail);
      return res.sendStatus(200);
    }
  );
});

module.exports = router;
