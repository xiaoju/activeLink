module.exports = publicReceipt =>
  (publicReceipt.paymentOption === 'creditCard' && !publicReceipt.livemode
    ? 'TEST / '
    : '') +
  publicReceipt.assoName +
  ' / ' +
  publicReceipt.mergedFamilyName +
  ' / ' +
  {
    moneyCheque: 'Registration (payment required)',
    bankTransfer: 'Registration (payment required)',
    creditCard: 'Confirmation of registration'
  }[publicReceipt.paymentOption] +
  (process.env.SILENT === 'true' ? ' - ADMIN INPUT -' : '');
