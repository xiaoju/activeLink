// need to check the checkbox of 'mandatoryItems' even if they weren't,
// and put a flag if problem there,
// need to check the family items got their cross from 'family' and only him (but can have no cross)

module.exports = ({
  familyId,
  frontendAllKids,
  frontendTotal,
  frontendFamilyById,
  frontendChecked,
  classItems,
  discountQualifiers,
  standardPrices,
  discountedPrices
}) => {
  const isValidGrade = (familyById, userId) =>
    familyById[userId].kidGrade !== ' ';

  const isValidFirstName = (familyById, userId) =>
    familyById[userId].firstName !== '';

  const isValidFamilyName = (familyById, userId) =>
    familyById[userId].familyName !== '';

  const isValidUser = userId =>
    isValidFirstName(frontendFamilyById, userId) &&
    isValidFamilyName(frontendFamilyById, userId) &&
    isValidGrade(frontendFamilyById, userId);

  const validKids = frontendAllKids.filter(isValidUser);

  const familyAndValidKids = [familyId].concat(validKids);

  const checkedItems = familyAndValidKids
    .map(thisUserId => frontendChecked[thisUserId])
    .reduce((outputArray, smallArray) => outputArray.concat(smallArray), []);
  // maybe the .reduce could be also done with: [].concat(...theSmallArrays)

  const applyDiscount =
    checkedItems.filter(item => discountQualifiers.includes(item)).length > 1;

  const backendTotal = checkedItems
    .filter(thisItemId => classItems.includes(thisItemId)) // don't count price for freeOfCharge items, such as volunteering items and consent form answer
    .map(
      applyDiscount
        ? thisItemId => discountedPrices[thisItemId]
        : thisItemId => standardPrices[thisItemId]
    ) // replace each itemId by the price to be paid
    .reduce((outputSum, smallAmount) => outputSum + smallAmount, 0);

  const errorTotal = backendTotal !== frontendTotal;

  return {
    backendTotal,
    errorTotal,
    applyDiscount,
    checkedItems,
    familyAndValidKids
  };
};
