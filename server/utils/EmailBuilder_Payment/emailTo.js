module.exports = publicReceipt =>
  process.env.NODE_ENV === 'production' && process.env.SILENT === 'false'
    ? publicReceipt.primaryEmail
    : 'dev@xiaoju.io';
