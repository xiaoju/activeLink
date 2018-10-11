const keys = require('../config/keys');
const mailgun = require('mailgun-js')({
  apiKey: keys.mailgunAPIKey,
  domain: keys.mailgunDomain
});

module.exports = (req, token) =>
  new Promise((resolve, reject) => {
    const emailTo =
      process.env.NODE_ENV === 'production' && process.env.SILENT === 'false'
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

    mailgun.messages().send(emailData, error => {
      if (error) {
        error.status = 500;
        // prettier-ignore
        error.privateBackendMessage =
          '\n' +
          'Failed emailing reset token: ' +
          'http://' + req.headers.host + '/reset/' + token +
          '\n';
        // NB privateBackendMessage must NOT be sent to client! (security issue)
        return reject(error);
      }
      return resolve(emailTo);
    });
  });
