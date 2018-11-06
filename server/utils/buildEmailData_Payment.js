const thisEmail = require('./EmailBuilder_Payment');

exports.buildEmailData = function(publicReceipt, thisAsso) {
  const thisEmailSubject = thisEmail.subject(publicReceipt);
  const thisEmailTo = thisEmail.emailTo(publicReceipt);
  const thisEmailCc = thisEmail.emailCc(thisAsso);
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

  const EmailData = {
    from: thisAsso.replyTo,
    to: thisEmailTo,
    // 'h:Reply-To': thisAsso.replyTo,
    subject: thisEmailSubject,
    text: thisEmailText,
    frontEndData: publicReceipt
  };

  if (thisEmailCc) {
    EmailData.cc = thisEmailCc;
  }

  return EmailData;
};
