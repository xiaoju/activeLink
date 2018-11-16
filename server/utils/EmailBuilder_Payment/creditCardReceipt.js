module.exports = publicReceipt =>
  publicReceipt.paymentOption === 'creditCard' && process.env.SILENT === 'false'
    ? `# Payment receipt #
- Receipt No.: ${publicReceipt.chargeId}
- Credit card number: xxxx xxxx xxxx ${publicReceipt.last4}
- Total paid: ${publicReceipt.total / 100} EUR
- Payment status: ${publicReceipt.status}
- Time: ${new Date(1000 * publicReceipt.timeStamp).toLocaleString()}
`
    : '';
