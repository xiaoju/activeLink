const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
var async = require('async'); // TODO remove this dependancy, using promises or `async await` instead
const keys = require('../../config/keys');
var mailgun = require('mailgun-js')({
  apiKey: keys.mailgunAPIKey,
  domain: keys.mailgunDomain
});

router.post('/:token', async function(req, res) {
  console.log('resetPassword ROUTE, process.env.SILENT: ', process.env.SILENT);
  console.log('!process.env.SILENT: ', !process.env.SILENT);
  let emailTo;
  async.waterfall(
    [
      function(done) {
        console.log(
          'resetPassword.js ROUTE, req.params.token: ',
          req.params.token
        );
        Family.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(error, family) {
            if (!family) {
              console.log('ERROR by ROUTE resetPassword.js, ERROR 34');
              return res.status(500).json({
                passwordWasChanged: false,
                message: 'Password reset token is invalid or has expired.'
              });
            }

            console.log(
              'ROUTE resetPassword.js, found family that matches the ',
              'token (family.primaryEmail: )',
              family.primaryEmail
            );

            console.log('req.body.password: ', req.body.password);

            family.password = req.body.password;
            family.resetPasswordToken = undefined;
            family.resetPasswordExpires = undefined;

            family.save(function(error) {
              console.log('resetPassword.js, 58, logging in');
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
            console.log(
              'ERROR by sending confirmation email to ',
              emailTo,
              ' after PASSWORD RESET by ',
              family.primaryEmail
            );
          }
          res.status(200).json({ passwordWasChanged: true, body });
        });
        // TODO message to show on next page: 'Success! Your password has been changed.'
      }
    ],
    // here the final callback to catch errors within the waterfall
    function(error) {
      // res.redirect('/');
      console.log('reset_token.js, ERROR 91');
      return res.status(500).json({
        passwordWasChanged: false,
        message: 'ERROR 91',
        error
      });
    }
  );
});

module.exports = router;
