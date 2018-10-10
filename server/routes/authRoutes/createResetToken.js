const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const util = require('util');
const crypto = require('crypto');
const randomBytes = util.promisify(crypto.randomBytes);
const emailResetToken = require('../../utils/emailResetToken');
const wrapAsync = require('../../utils/wrapAsync');

const AppError = require('../../errors/AppError');
const UserNotFoundError = require('../../errors/UserNotFoundError');

router.post(
  '/',
  wrapAsync(async (req, res, next) => {
    const buf = await randomBytes(20);
    const token = buf.toString('hex');
    const family = await Family.findOne({
      primaryEmail: req.body.primaryEmail
    });
    // TODO handle fast the lost connections to db

    if (!family) {
      throw new UserNotFoundError();
    }

    family.resetPasswordToken = token;
    family.resetPasswordExpires = Date.now() + 25 * 60 * 60 * 1000; // 25 hours
    family.save();

    const emailTo = await emailResetToken(req, token);

    // prettier-ignore
    console.log(
    req.ip, ',', req.body.primaryEmail,':',
    'SENT LINK http://' + req.headers.host + '/reset/' + token,
    'to', emailTo,
    'for', req.body.primaryEmail
  );
    return res.status(200).json({ emailTo });
  })
);

module.exports = router;
