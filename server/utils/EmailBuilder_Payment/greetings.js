const capitalizeFirstLetter = require('../capitalizeFirstLetter');

module.exports = publicReceipt =>
  process.env.SILENT === 'true'
    ? ''
    : `Dear ${capitalizeFirstLetter(
        publicReceipt.users[publicReceipt.allParents[0]].firstName
      )},

thank you for your \
${publicReceipt.paymentOption === 'creditCard' ? '' : 'pre-'}\
registration \
to ${publicReceipt.assoName}!
You find below a summary of the information you submitted.
Please contact us if you notice any error.
`;
