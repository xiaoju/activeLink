const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const wrapAsync = require('../../utils/wrapAsync');
const TokenNotFound = require('../../errors/TokenNotFound');
const TokenTooOld = require('../../errors/TokenTooOld');

router.get(
  '/:token',
  wrapAsync(async (req, res, next) => {
    const validTokenfamily = await Family.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (validTokenfamily) {
      console.log(
        req.ip,
        validTokenfamily.primaryEmail,
        ': CLICKED the reset link from his email'
      );
      return res.sendStatus(200);
    }

    const invalidTokenFamily = await Family.findOne({
      resetPasswordToken: req.params.token
    });

    if (invalidTokenFamily) {
      console.log(invalidTokenFamily.primaryEmail);
      throw new TokenTooOld();
    }

    throw new TokenNotFound();
  })
);

module.exports = router;
