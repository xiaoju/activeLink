module.exports = publicReceipt =>
  // prettier-ignore
  publicReceipt.paymentOption === 'creditCard' && process.env.SILENT === 'false'
      ? '# Payment receipt #\n\n' +
        '- Receipt No.: ' + publicReceipt.chargeId + '\n' +
        '- Credit card number: xxxx xxxx xxxx ' + publicReceipt.last4 + '\n' +
        '- Total paid: ' + publicReceipt.total / 100 + ' EUR \n' +
        '- Payment status: ' + publicReceipt.status + '\n' +
        '- Time: ' + new Date(1000 * publicReceipt.timeStamp).toLocaleString() + '\n\n'
      : '';
