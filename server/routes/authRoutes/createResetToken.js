const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
var async = require('async'); // TODO remove this dependancy, using promises or `async await` instead
var crypto = require('crypto');
const keys = require('../../config/keys');
var mailgun = require('mailgun-js')({
  apiKey: keys.mailgunAPIKey,
  domain: keys.mailgunDomain
});

router.post('/', async function(req, res) {
  console.log('createResetToken ROUTE');
  let emailTo;
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Family.findOne({ primaryEmail: req.body.primaryEmail }, function(
        err,
        family
      ) {
        if (err) {
          console.log('ERROR 28, reset.js, by ', req.body.primaryEmail);
          return res.status(500).json({
            message:
              'Sorry, the server encountered an issue. ' +
              'Please try again later or contact dev@xiaoju.io for support.',
            resetTokenEmailSent: false,
            error: 'ERROR 28, reset.js'
          });
        }

        if (!family) {
          console.log(
            'RESET.js ERROR, email not recognized: ',
            req.body.primaryEmail
          );
          return res.status(401).json({
            message:
              'We could not recognize your email address. Please double ' +
              'check that the email address you typed is the one where you ' +
              'received an invitation. ' +
              'You can also contact dev@xiaoju.io for support.',
            resetTokenEmailSent: false,
            error: 'No account with that email address.'
          });
        }

        family.resetPasswordToken = token;
        // family.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        family.resetPasswordExpires = Date.now() + 25 * 60 * 60 * 1000; // 25 hours

        try {
          family.save(function(err) {
            done(err, token, family);
          });
        } catch (err) {
          console.log('reset.js, ', req.body.primaryEmail, ' ERROR 62: ', err);
          return res.status(500).json({
            message:
              'Sorry, there was a problem with the server. ' +
              'Please try again later or contact dev@xiaoju.io for support.',
            resetTokenEmailSent: false
          });
        }
      });
    },
    function(token, family, done) {
      emailTo =
        process.env.NODE_ENV === 'production' && !process.env.SILENT
          ? family.primaryEmail
          : 'dev@xiaoju.io';

      // prettier-ignore
      const emailData = {
        from: 'The English Link <english-link@xiaoju.io>',
        to: emailTo,
        'h:Reply-To': 'englishlink31@gmail.com',
        subject: 'English-Link / password reset link',
        text:
          'Hello,\n\n' +
          'You are receiving this email because you (or someone else) has ' +
          'requested a password reset for your English Link account.\n\n' +
          'Please click on the following link, or paste it into your ' +
          'internet browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'This link is valid during 24 hours only.\n\n' +
          'If you did not request a new password, please ignore this email ' +
          'and your password will remain unchanged.\n\n' +
          'Kind Regards,\n' +
          'Jerome'
      };
      // prettier-ignore
      mailgun.messages().send(emailData, function(error, body) {
        if (error) {
          console.log(
            'ERROR by emailing reset link ' +
            'http://' + req.headers.host + '/reset/' + token +
            ' to ', emailTo,
            ' for ', family.primaryEmail, ': ',
            error
          );
          return res.status(500).json({
            message:
              'Sorry, there was a problem with our mail server ' +
              "and we couldn't send you the reset link. " +
              'Please try again later or contact dev@xiaoju.io for support.',
            resetTokenEmailSent: false,
            error
          });
        } else {
          console.log(
            'SENT LINK http://' +
              req.headers.host +
              '/reset/' +
              token +
              ' for ' +
              family.primaryEmail +
              ' to ' +
              emailTo
          );
          return res.status(200).json({
            message: 'An email with a reset link has been sent',
            resetTokenEmailSent: true,
            emailedTo: emailTo,
            body
          });
        }
      });
    }
  ]);
});

module.exports = router;
