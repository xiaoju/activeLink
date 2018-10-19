const capitalizeFirstLetter = require('../capitalizeFirstLetter');

module.exports = publicReceipt =>
  publicReceipt.allKids
    .map(
      kidId =>
        capitalizeFirstLetter(publicReceipt.users[kidId].firstName) +
        ' ' +
        publicReceipt.users[kidId].familyName.toUpperCase()
    )
    .join(' & ');
