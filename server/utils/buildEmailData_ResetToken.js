module.exports = (req, token) => {
  const emailTo =
    process.env.NODE_ENV === 'production' && process.env.SILENT === 'false'
      ? family.primaryEmail
      : 'dev@xiaoju.io';

  const resetLink = 'http://' + req.headers.host + '/reset/' + token;

  const bodyText = `Hello,

You are receiving this email because you (or someone else) has requested a \
password reset for your English Link account.

Please click on the following link, or paste it into your internet browser to \
complete the process:
   ${resetLink}
   
This link is valid during 24 hours only.
If you did not request a new password, please ignore this email and your \
password will remain unchanged.

Kind Regards,
Jerome`;

  const emailData = {
    privateBackendMessage: resetLink,
    from: 'The English Link <english-link@xiaoju.io>',
    to: emailTo,
    'h:Reply-To': 'englishlink31@gmail.com',
    subject: 'English-Link / password reset link',
    text: bodyText
  };

  return emailData;
};
