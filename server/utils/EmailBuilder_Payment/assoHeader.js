module.exports = publicReceipt =>
  `- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
${publicReceipt.assoName}
${publicReceipt.assoAddress}
Association registered at the prefecture under number ${
    publicReceipt.assoReferenceNumbers.SIRETnumber
  }

${publicReceipt.eventName}
`;
