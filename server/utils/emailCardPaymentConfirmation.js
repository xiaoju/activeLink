const keys = require('../config/keys');
const mailgun = require('mailgun-js')({
  apiKey: keys.mailgunAPIKey,
  domain: keys.mailgunDomain
});

// TODO review which parameters to pass
module.exports = publicReceipt =>
  new Promise((resolve, reject) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // send confirmation email to primaryEmail and to backupEmail

    const FullTextKidsNames = publicReceipt.allKids
      .map(
        kidId =>
          capitalizeFirstLetter(publicReceipt.users[kidId].firstName) +
          ' ' +
          publicReceipt.users[kidId].familyName.toUpperCase()
      )
      .join(' & ');

    const paymentDatesString = publicReceipt.datesToPay
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

    const email_Volunteering =
      '# Volunteering # \n\n' +
      (publicReceipt.purchasedVolunteeringItems.length > 0
        ? 'I volunteer to help with following activities:\n' +
          publicReceipt.purchasedVolunteeringItems
            .map(itemId => '- ' + publicReceipt.purchasedItemsById[itemId].name)
            .join('\n')
        : 'I choose not to volunteer to assist with any activities at this time.') +
      '\n\n';

    const email_Closing =
      '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n';

    // prettier-ignore
    const email_Greetings = process.env.SILENT === 'true' ? '' :
  'Dear ' + capitalizeFirstLetter(
    publicReceipt.users[publicReceipt.allParents[0]].firstName) + ',\n\n' +
  'thank you for your ' +
  (paymentOption === 'creditCard' ? '' : 'pre-') + 'registration to ' +
  thisAsso.name + '!\n' +
  'You find below a summary of the information you submitted. ' +
  'Please contact us if you notice any error.\n\n';

    // prettier-ignore
    const email_PaymentInstructions =
  paymentOption !== 'creditCard' && process.env.SILENT === 'false' ?
      'To complete this registration, please proceed with the payment, ' +
      'either per cheque, either per bank transfer:\n\n' +
      'Per cheque: \n' +
      '    - 3 cheques of ' + Math.ceil(publicReceipt.total / 300) + ' EUR each,\n' +
      '         to be dropped in the mailbox of ' + thisAsso.name + ',\n' +
      '         and that will be cashed on:\n' + paymentDatesString + '\n' +
      '      or 1 cheque only of ' + Math.ceil(publicReceipt.total / 100) + ' EUR,\n' +
      '    - to the order of: ' + thisAsso.name + '.\n' +
      '    - Object (important!): ' + paymentReference + '.\n\n' +
      'Per bank transfer: \n' +
      '    - 3 payments of ' + Math.ceil(publicReceipt.total / 300) + ' EUR each,\n' +
      '      or 1 payment only of ' + Math.ceil(publicReceipt.total / 100) + ' EUR\n' +
      '    - IBAN: ' + thisAsso.bankReference[0].IBAN + '\n' +
      '    - BIC: ' + thisAsso.bankReference[0].BIC + '\n' +
      '    - Name of the bank: ' + thisAsso.bankReference[0].BankName + '\n' +
      '    - Account owner: ' + thisAsso.name + '\n' +
      '    - Reference to write (important!): ' + paymentReference + '\n' +
      '    - Deadlines for the transfers:\n' + paymentDatesString + '\n\n'
    : '';

    // prettier-ignore
    const email_CreditCardReceipt =
  paymentOption === 'creditCard' && process.env.SILENT === 'false'
    ? '# Payment receipt #\n\n' +
      '- Receipt No.: ' + publicReceipt.chargeId + '\n' +
      '- Credit card number: xxxx xxxx xxxx ' + publicReceipt.last4 + '\n' +
      '- Total paid: ' + publicReceipt.total / 100 + ' EUR \n' +
      '- Payment status: ' + publicReceipt.status + '\n' +
      '- Time: ' + new Date(1000 * publicReceipt.timeStamp).toLocaleString() + '\n\n'
    : '';

    const email_Regards =
      process.env.SILENT === 'true' ? '' : 'Kind Regards,\n' + 'Jerome\n\n';

    const email_ForOther =
      process.env.SILENT === 'true' ? '[Data input by admin]\n\n' : '';

    // prettier-ignore
    const email_AssoHeader =
  '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n' +
  thisAsso.name + '\n' +
  thisAsso.address + '\n' +
  'Association registered at the prefecture under number ' +
  thisAsso.referenceNumbers.SIRETnumber + '\n\n' +
  thisEvent.eventName + '\n\n';

    const email_Profile =
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
          address =>
            '- address (' + address.tags.join(', ') + '): ' + address.value
        )
        .join('\n') +
      '\n\n';

    const email_SelectedClasses =
      '# Selected classes # \n\n' +
      publicReceipt.purchasedClassItems
        .map(
          itemId =>
            '- ' +
            publicReceipt.purchasedItemsById[itemId].name +
            ', ' +
            publicReceipt.purchasedItemsById[itemId].period +
            ', for ' +
            publicReceipt.purchasedItemsById[itemId].beneficiaries
              .map(
                userId =>
                  userId === publicReceipt.familyId
                    ? 'the whole family'
                    : capitalizeFirstLetter(
                        publicReceipt.users[userId].firstName
                      )
              )
              .join(' & ') +
            '. Unit price: ' +
            publicReceipt.purchasedItemsById[itemId].paidPrice / 100 +
            ' EUR.'
        )
        .join('\n') +
      '\n\n';

    const email_PhotoConsent =
      '# Photo & Video Consent # \n\n' +
      (publicReceipt.photoConsent
        ? 'I give permission to ' +
          thisAsso.name +
          ' to take photographs and videos of my child(ren) ' +
          FullTextKidsNames +
          ', and I grant ' +
          thisAsso.name +
          ' the full rights to use the images resulting from the photography ' +
          'and video filming, and any reproductions or ' +
          'adaptations of the images for fundraising, publicity or other ' +
          "purposes to help achieve the association's aims. This might include " +
          '(but is not limited to) the right to use them in their printed and ' +
          'online newsletters, websites, publicities, social media, press ' +
          'releases and funding applications'
        : "I don't give permission to " +
          thisAsso.name +
          ' to take photographs and videos of my child(ren) ' +
          FullTextKidsNames) +
      '.\nSignature: ' +
      capitalizeFirstLetter(
        publicReceipt.users[publicReceipt.allParents[0]].firstName
      ) +
      ' ' +
      publicReceipt.users[
        publicReceipt.allParents[0]
      ].familyName.toUpperCase() +
      '\n\n';

    const email_Text =
      email_Greetings +
      email_PaymentInstructions +
      email_Regards +
      email_ForOther +
      email_AssoHeader +
      email_CreditCardReceipt +
      email_Profile +
      email_SelectedClasses +
      email_PhotoConsent +
      email_Volunteering +
      email_Closing;

    const emailTo =
      process.env.NODE_ENV === 'production' && process.env.SILENT === 'false'
        ? primaryEmail
        : 'dev@xiaoju.io';

    const email_Subject =
      (paymentOption === 'creditCard' && !publicReceipt.livemode
        ? 'TEST / '
        : '') +
      thisAsso.name +
      ' / ' +
      mergedFamilyName +
      ' / ' +
      {
        moneyCheque: 'Registration (payment required)',
        bankTransfer: 'Registration (payment required)',
        creditCard: 'Confirmation of registration'
      }[paymentOption] +
      (process.env.SILENT === 'true' ? ' - ADMIN INPUT -' : '');

    const email_Data = {
      from: thisAsso.emailFrom,
      to: emailTo,
      cc: thisAsso.backupEmail,
      'h:Reply-To': thisAsso.replyTo,
      subject: email_Subject,
      text: email_Text
    };

    mailgun.messages().send(email_Data, function(error, body) {
      if (error) {
        return reject(error);
      }
      console.log(
        req.ip,
        primaryEmail,
        ': REGISTRATION CONFIRMATION sent to',
        emailTo,
        'and',
        thisAsso.backupEmail,
        '. Payment option: ',
        paymentOption
      );
      return resolve(publicReceipt);
    });
  });
