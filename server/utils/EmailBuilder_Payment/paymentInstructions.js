const paymentDatesString = require('./paymentDatesString');

module.exports = publicReceipt =>
  publicReceipt.paymentOption !== 'creditCard'
    ? `To complete this registration, please proceed with the payment, \
either per cheque, either per bank transfer:

Per cheque:
    - 3 cheques of ${Math.ceil(publicReceipt.total / 300)} EUR each,
          to be dropped in the mailbox of ${publicReceipt.assoName}
          and that will be cashed on: ${paymentDatesString(publicReceipt)}
      or 1 cheque only of ${Math.ceil(publicReceipt.total / 100)} EUR,
    - to the order of: ${publicReceipt.assoName}.
    - Object (important!): ${publicReceipt.paymentReference}.

Per bank transfer:
    - 3 payments of ${Math.ceil(publicReceipt.total / 300)} EUR each,
      or 1 payment only of ${Math.ceil(publicReceipt.total / 100)} EUR.
    - IBAN: ${publicReceipt.bankReference.IBAN}
    - BIC: ${publicReceipt.bankReference.BIC}
    - Name of the bank: ${publicReceipt.bankReference.BankName}
    - Account owner: ${publicReceipt.assoName}
    - Reference to write (important!): ${publicReceipt.paymentReference}
    - Deadlines for the transfers: ${paymentDatesString(publicReceipt)}

`
    : '';
