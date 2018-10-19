module.exports = publicReceipt =>
  publicReceipt.datesToPay
    .map(
      timeStamp =>
        '            ' +
        new Date(timeStamp * 1).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
    )
    .join('\n');
