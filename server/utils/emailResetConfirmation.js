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

    mailgun.messages().send(emailData, error => {
      if (error) {
        error.status = 500;
        return reject(error);
      }
      return resolve(emailTo);
    });
  });

'ERROR by sending confirmation email to ',
  emailTo,
  ' after PASSWORD RESET by ',
  family.primaryEmail;
