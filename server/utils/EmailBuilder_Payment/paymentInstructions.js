const paymentDatesString = require('./paymentDatesString');

module.exports = publicReceipt =>
  // prettier-ignore
  publicReceipt.paymentOption !== 'creditCard' && process.env.SILENT === 'false' ?
        'To complete this registration, please proceed with the payment, ' +
        'either per cheque, either per bank transfer:\n\n' +
        'Per cheque: \n' +
        '    - 3 cheques of ' + Math.ceil(publicReceipt.total / 300) + ' EUR each,\n' +
        '         to be dropped in the mailbox of ' + publicReceipt.assoName + ',\n' +
        '         and that will be cashed on:\n' + paymentDatesString + '\n' +
        '      or 1 cheque only of ' + Math.ceil(publicReceipt.total / 100) + ' EUR,\n' +
        '    - to the order of: ' + publicReceipt.assoName + '.\n' +
        '    - Object (important!): ' + publicReceipt.paymentReference + '.\n\n' +
        'Per bank transfer: \n' +
        '    - 3 payments of ' + Math.ceil(publicReceipt.total / 300) + ' EUR each,\n' +
        '      or 1 payment only of ' + Math.ceil(publicReceipt.total / 100) + ' EUR\n' +
        '    - IBAN: ' + publicReceipt.bankReference.IBAN + '\n' +
        '    - BIC: ' + publicReceipt.bankReference.BIC + '\n' +
        '    - Name of the bank: ' + publicReceipt.bankReference.BankName + '\n' +
        '    - Account owner: ' + publicReceipt.assoName + '\n' +
        '    - Reference to write (important!): ' + publicReceipt.paymentReference + '\n' +
        '    - Deadlines for the transfers:\n' + paymentDatesString + '\n\n'
      : '';
