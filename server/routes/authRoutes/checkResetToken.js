const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Family = mongoose.model('families');

router.get('/', async function(req, res) {
  Family.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(error, family) {
      // TODO handle error
      if (!family) {
        console.log('FAILED TOKEN CHECK by somebody');
        // TODO search again for the family, but without the {$gt: Date.now()}
        // constraint, so I can log who got a problem
        // TODO and use promises instead of callbacks!
        return res.status(401).json({
          tokenIsValid: false,
          message:
            'Invalid token: the token to reset the password is not ' +
            'valid or has expired.'
        });
      }
      console.log('CLICKED the reset link: ', family.primaryEmail);
      return res.status(200).json({ tokenIsValid: true });
    }
  );
});

module.exports = router;
