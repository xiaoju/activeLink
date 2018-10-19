module.exports = publicReceipt =>
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
                : capitalizeFirstLetter(publicReceipt.users[userId].firstName)
          )
          .join(' & ') +
        '. Unit price: ' +
        publicReceipt.purchasedItemsById[itemId].paidPrice / 100 +
        ' EUR.'
    )
    .join('\n') +
  '\n\n';
