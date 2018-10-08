const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const util = require('util');
const crypto = require('crypto');
const randomBytes = util.promisify(crypto.randomBytes);
const emailResetToken = require('../../utils/emailResetToken');

router.post('/', async function(req, res) {
  let token, emailedTo;
  try {
    const buf = await randomBytes(20);
    token = buf.toString('hex');
    const family = await Family.findOne({
      primaryEmail: req.body.primaryEmail
    });

    if (!family) {
      return res.sendStatus(401);
    }

    family.resetPasswordToken = token;
    family.resetPasswordExpires = Date.now() + 25 * 60 * 60 * 1000; // 25 hours
    family.save();
  } catch (error) {
    console.log(
      req.ip,
      ', ',
      req.body.primaryEmail,
      ', ERROR by createResetToken, db access: ',
      error
    );
    return res.sendStatus(500);
  }
  try {
    emailTo = await emailResetToken(req, token);
  } catch (error) {
    console.log(
      req.ip,
      ', ',
      req.body.primaryEmail,
      ' ERROR by createResetToken, emailResetToken(): ',
      error
    );
    return res.sendStatus(500);
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
