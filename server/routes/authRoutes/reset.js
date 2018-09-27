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
  let emailTo;
  async.waterfall(
    [
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
          if (!family) {
            return res.json({
              resetTokenEmailSent: false,
              error: 'No account with that email address.'
            });
          }

          family.resetPasswordToken = token;
          family.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          family.save(function(err) {
            done(err, token, family);
          });
        });
      },
      function(token, family, done) {
        emailTo =
          process.env.NODE_ENV === 'production' && !process.env.SILENT
            ? family.primaryEmail
            : 'dev@xiaoju.io';

        const emailData = {
          from: 'The English Link <english-link@xiaoju.io>',
          to: emailTo,
          'h:Reply-To': 'englishlink31@gmail.com',
          subject: 'English-Link / password reset link',
          text:
            'Hello,\n\n' +
            'You are receiving this email because you (or someone else) has requested a password reset for your English Link account.\n\n' +
            'Please click on the following link, or paste it into your internet browser to complete the process:\n\n' +
            'http://' +
            req.headers.host +
            '/reset/' +
            token +
            '\n\n' +
            'If you did not request a new password, please ignore this email and your password will remain unchanged.\n\n' +
            'Kind Regards,\n' +
            'Jerome'
        };
        mailgun.messages().send(emailData, function(error, body) {
          if (error) {
            console.log('ERROR by email sending: ', error);
            return res.json({
              resetTokenEmailSent: false,
              error
            });
          } else {
            console.log(
              'The link http://' +
                req.headers.host +
                '/reset/' +
                token +
                ' for ' +
                family.primaryEmail +
                ' has been sent to ' +
                emailTo
            );
            return res.json({
              resetTokenEmailSent: true,
              emailedTo: emailTo,
              body
            });
          }
        });
      }
    ]
    // , function(err) {
    // if (err) return next(err);
    // return res.json({ resetTokenEmailSent: false, error });
    // }
  );
});

module.exports = router;
