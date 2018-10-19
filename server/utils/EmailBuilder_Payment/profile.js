const capitalizeFirstLetter = require('../capitalizeFirstLetter');

module.exports = publicReceipt =>
  '# Profile #\n\n' +
  '## Children ##\n\n' +
  publicReceipt.allKids
    .map(
      kidId =>
        '- ' +
        capitalizeFirstLetter(publicReceipt.users[kidId].firstName) +
        ' ' +
        publicReceipt.users[kidId].familyName.toUpperCase() +
        ', ' +
        publicReceipt.users[kidId].kidGrade
    )
    .join('\n') +
  '\n\n' +
  '## Parents ##\n\n' +
  publicReceipt.allParents
    .map(
      parentId =>
        '- ' +
        capitalizeFirstLetter(publicReceipt.users[parentId].firstName) +
        ' ' +
        publicReceipt.users[parentId].familyName.toUpperCase()
    )
    .join('\n') +
  '\n\n' +
  '## Phones, emails, post addresses ##\n\n' +
  '- Primary email: ' +
  publicReceipt.primaryEmail +
  '\n' +
  publicReceipt.familyMedia
    .map(
      media =>
        '- ' +
        media.media +
        ' (' +
        media.tags.join(', ') +
        '): ' +
        media.value +
        '\n'
    )
    .join() +
  publicReceipt.addresses
    .map(
      address => '- address (' + address.tags.join(', ') + '): ' + address.value
    )
    .join('\n') +
  '\n\n';
