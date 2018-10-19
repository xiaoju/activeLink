module.exports = publicReceipt =>
  '# Volunteering # \n\n' +
  (publicReceipt.purchasedVolunteeringItems.length > 0
    ? 'I volunteer to help with following activities:\n' +
      publicReceipt.purchasedVolunteeringItems
        .map(itemId => '- ' + publicReceipt.purchasedItemsById[itemId].name)
        .join('\n')
    : 'I choose not to volunteer to assist with any activities at this time.') +
  '\n\n';
