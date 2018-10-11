const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const wrapAsync = require('../../utils/wrapAsync');
const util = require('util');
const UserNotFound = require('../../errors/UserNotFound');
const emailResetConfirmation = require('../../utils/emailResetConfirmation');

router.post(
  '/',
  wrapAsync(async function(req, res, next) {
    const family = await Family.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!family) {
      throw new UserNotFound();
    }

    family.password = req.body.password;
    family.resetPasswordToken = undefined;
    family.resetPasswordExpires = undefined;
    const updatedFamily = await family.save();

    // console.log('resetPassword.js, updatedFamily._id: ', updatedFamily._id);

    // await util.promisify(req.logIn)(updatedFamily);

    req.logIn(updatedFamily, function(err) {
      if (err) {
        return next(err); // BUG how to test this case?
      }
    });

    // const buggedFamily = { id: 'abc123' };
    // try {
    //   req.logIn(buggedFamily, function(err) {
    //     console.log('Running logIn err callback');
    //     if (err) {
    //       console.log('OOOOOO');
    //       return next(err); // BUG how to test this case?
    //     }
    //   });
    // } catch (error) {
    //   console.log('OUPS!');
    // }
    res.sendStatus(200);
    console.log('Ready to send out the confirmation email...');
    return await emailResetConfirmation(req, updatedFamily.primaryEmail);
  })
);

module.exports = router;
