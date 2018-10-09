const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const util = require('util');
const crypto = require('crypto');
const randomBytes = util.promisify(crypto.randomBytes);
const emailResetToken = require('../../utils/emailResetToken');

router.post('/', async function(req, res, next) {
  let token, emailedTo;
  try {
    const buf = await randomBytes(20);
    token = buf.toString('hex');
    const family = await Family.findOne({
      primaryEmail: req.body.primaryEmail
    });

    if (!family) {
      const error = new Error('No account with this email address.');
      error.httpStatusCode = 401;
      return next(error);
    }

    family.resetPasswordToken = token;
    family.resetPasswordExpires = Date.now() + 25 * 60 * 60 * 1000; // 25 hours
    family.save();
  } catch (error) {
    error.httpStatusCode = 500;
    return next(error);
  }

  try {
    emailTo = await emailResetToken(req, token);
  } catch (error) {
    return next(error);
  }
  // prettier-ignore
  console.log(
    req.ip, ',', req.body.primaryEmail,':',
    'SENT LINK http://' + req.headers.host + '/reset/' + token,
    'to', emailTo,
    'for', req.body.primaryEmail
  );
  return res.status(200).json({ emailTo });
});

module.exports = router;
