const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const util = require('util');
const crypto = require('crypto');
const randomBytes = util.promisify(crypto.randomBytes);
const emailResetToken = require('../../utils/emailResetToken');
const wrapAsync = require('../../utils/wrapAsync');

const AppError = require('../../errors/AppError');
const OrderNotFoundError = require('../../errors/OrderNotFoundError');
const UserNotFoundError = require('../../errors/UserNotFoundError');

// router.post('/', async function(req, res, next) {
router.post(
  '/',
  wrapAsync(async (req, res, next) => {
    const buf = await randomBytes(20);
    const token = buf.toString('hex');
    const family = await Family.findOne({
      primaryEmail: req.body.primaryEmail
    });

    // to test mongodb errors:
    // const family = await Family.find({ Date: { $last: 'Date' } })
    //   .catch(err => {
    //     err.httpStatusCode = 500;
    //     return next(err);
    //   });

    if (!family) {
      // const err = new UserNotFoundError();
      throw new UserNotFoundError();
      // const err = new Error('No account with this email address.');
      // // err.httpStatusCode = 401;
      // err.name = 'authError';
      // err.code = 'ENACWE';
      // throw err;
      // // return next(error);
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
