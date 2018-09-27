const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const requireLogin = require('../../middlewares/requireLogin');
const requireAdmin = require('../../middlewares/requireAdmin');
var async = require('async'); // TODO remove this dependancy, using promises or `async await` instead
const keys = require('../../config/keys');
var mailgun = require('mailgun-js')({
  apiKey: keys.mailgunAPIKey,
  domain: keys.mailgunDomain
});

router.post('/', requireLogin, requireAdmin, async function(req, res) {
  let emailTo;
  async.waterfall(
    [
      function(done) {
        Family.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(error, family) {
            if (!family) {
              return res.status(500).json({
                passwordWasChanged: false,
                error: 'Password reset token is invalid or has expired.'
              });
            }

            family.password = req.body.password;
            family.resetPasswordToken = undefined;
            family.resetPasswordExpires = undefined;

            family.save(function(error) {
              req.logIn(family, function(error) {
                done(error, family);
              });
            });
          }
        );
      },
      function(family, done) {
        emailTo =
          process.env.NODE_ENV === 'production' && !process.env.SILENT
            ? family.primaryEmail
            : 'dev@xiaoju.io';

        const emailData = {
          from: 'The English Link <english-link@xiaoju.io>',
          to: emailTo,
          'h:Reply-To': 'englishlink31@gmail.com',
          subject: 'English-Link / your password has been changed',
          text:
            'Hello,\n\n' +
            'the password has just been changed for your English-Link account ' +
            family.primaryEmail +
            '\n\n' +
            'Kind Regards,\n' +
            'Jerome'
        };
        mailgun.messages().send(emailData, function(error, body) {
          if (error) {
            return res.status(500).json({
              passwordWasChanged: false,
              error
            });
          } else {
            return res.status(200).json({
              passwordWasChanged: true,
              body
            });
          }
        });
        // TODO message to show on next page: 'Success! Your password has been changed.'
      }
    ],
    function(error) {
      // res.redirect('/');
      return res.json({
        passwordWasChanged: false,
        error
      });
    }
  );
});

module.exports = router;
