module.exports = publicReceipt =>
  // prettier-ignore
  '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n' +
    publicReceipt.assoName + '\n' +
    publicReceipt.assoAddress + '\n' +
    'Association registered at the prefecture under number ' +
    publicReceipt.assoReferenceNumbers.SIRETnumber + '\n\n' +
    publicReceipt.eventName + '\n\n';
