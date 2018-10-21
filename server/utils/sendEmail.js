const keys = require('../config/keys');
const mailgun = require('mailgun-js')({
  apiKey: keys.mailgunAPIKey,
  domain: keys.mailgunDomain
});

module.exports = emailData =>
  new Promise((resolve, reject) => {
    mailgun.messages().send(emailData, error => {
      if (error) {
        error.statusCode = 503;
        error.frontEndData = emailData.frontEndData;
        // even if mailing failed, still should pass the "frontEndData" to client
        // to show some on-screen confirmation. We even could send them the
        // confirmation email later manually
        error.privateBackendMessage = emailData.privateBackendMessage;
        return reject(error);
      }
      return resolve(emailData);
    });
  });
