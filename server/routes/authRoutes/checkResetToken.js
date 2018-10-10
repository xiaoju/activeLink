const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const wrapAsync = require('../../utils/wrapAsync');
const AppError = require('../../errors/AppError');
const TokenNotFoundError = require('../../errors/TokenNotFoundError');

router.get(
  '/:token',
  wrapAsync(async (req, res, next) => {
    const family = await Family.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!family) {
      throw new TokenNotFoundError();
    }

    console.log(
      req.ip,
      family.primaryEmail,
      ': CLICKED the reset link from his email'
    );
    return res.sendStatus(200);
  })
);

module.exports = router;
