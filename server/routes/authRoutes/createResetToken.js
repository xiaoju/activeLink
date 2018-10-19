const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const util = require('util');
const crypto = require('crypto');
const randomBytes = util.promisify(crypto.randomBytes);
const emailResetToken = require('../../utils/emailResetToken');
const wrapAsync = require('../../utils/wrapAsync');
const UserNotFound = require('../../errors/UserNotFound');

router.post(
  '/',
  wrapAsync(async (req, res, next) => {
    const buf = await randomBytes(20);
    const token = buf.toString('hex');
    const family = await Family.findOne({
      primaryEmail: req.body.primaryEmail
    });

    if (!family) {
      throw new UserNotFound();
    }

    family.resetPasswordToken = token;
    family.resetPasswordExpires = Date.now() + 25 * 60 * 60 * 1000; // 25 hours
    await family.save();

    // const emailData = buildEmailData(req, token);
    // const { emailTo, resetLink } = await emailResetToken(emailData);

    const { emailTo, resetLink } = await emailResetToken(req, token);

    console.log(
      '%s %s : SENT LINK %s to %s',
      req.ip,
      req.body.primaryEmail,
      resetLink,
      emailTo
    );
    return res.status(200).json({ emailTo });
  })
);

module.exports = router;
