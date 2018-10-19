const thisEmail = require('./EmailBuilder_Payment');

exports.buildEmailData = function(publicReceipt, thisAsso) {
  const thisEmailSubject = thisEmail.subject(publicReceipt);
  const thisEmailTo = thisEmail.emailTo(publicReceipt);
  const thisEmailText =
    thisEmail.greetings(publicReceipt) +
    thisEmail.paymentInstructions(publicReceipt) +
    thisEmail.regards +
    thisEmail.forOther +
    thisEmail.assoHeader(publicReceipt) +
    thisEmail.creditCardReceipt(publicReceipt) +
    thisEmail.profile(publicReceipt) +
    thisEmail.selectedClasses(publicReceipt) +
    thisEmail.photoConsent(publicReceipt) +
    thisEmail.volunteering(publicReceipt) +
    thisEmail.closing;

  return {
    from: thisAsso.emailFrom,
    to: thisEmailTo,
    cc: thisAsso.backupEmail,
    'h:Reply-To': thisAsso.replyTo,
    subject: thisEmailSubject,
    text: thisEmailText,
    frontEndData: publicReceipt
  };
};
