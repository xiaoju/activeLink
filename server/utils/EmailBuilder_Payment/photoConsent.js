const FullTextKidsNames = require('./FullTextKidsNames');
const capitalizeFirstLetter = require('../capitalizeFirstLetter');

module.exports = publicReceipt =>
  '# Photo & Video Consent # \n\n' +
  (publicReceipt.photoConsent
    ? 'I give permission to ' +
      publicReceipt.assoName +
      ' to take photographs and videos of my child(ren) ' +
      FullTextKidsNames(publicReceipt) +
      ', and I grant ' +
      publicReceipt.assoName +
      ' the full rights to use the images resulting from the photography ' +
      'and video filming, and any reproductions or ' +
      'adaptations of the images for fundraising, publicity or other ' +
      "purposes to help achieve the association's aims. This might include " +
      '(but is not limited to) the right to use them in their printed and ' +
      'online newsletters, websites, publicities, social media, press ' +
      'releases and funding applications'
    : "I don't give permission to " +
      publicReceipt.assoName +
      ' to take photographs and videos of my child(ren) ' +
      FullTextKidsNames(publicReceipt)) +
  '.\nSignature: ' +
  capitalizeFirstLetter(
    publicReceipt.users[publicReceipt.allParents[0]].firstName
  ) +
  ' ' +
  publicReceipt.users[publicReceipt.allParents[0]].familyName.toUpperCase() +
  '\n\n';
