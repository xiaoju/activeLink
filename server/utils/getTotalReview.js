// need to check the checkbox of 'mandatoryItems' even if they weren't,
// and put a flag if problem there,
// need to check the family items got their cross from 'family' and only him (but can have no cross)

module.exports = ({
  frontendTotal,
  allKids,
  familyPerId,
  discountQualifiers,
  standardPrices,
  discountedPrices,
  checked
}) => {
  const isValidGrade = (familyPerId, userId) =>
    familyPerId[userId].kidGrade !== ' ';

  const isValidFirstName = (familyPerId, userId) =>
    familyPerId[userId].firstName !== '';

  const isValidFamilyName = (familyPerId, userId) =>
    familyPerId[userId].familyName !== '';

  const isValidUser = userId =>
    isValidFirstName(familyPerId, userId) &&
    isValidFamilyName(familyPerId, userId) &&
    isValidGrade(familyPerId, userId);

  const validKids = allKids.filter(isValidUser);

  const familyAndValidKids = ['family'].concat(validKids);

  const checkedItems = familyAndValidKids
    .map(thisUserId => checked[thisUserId])
    .reduce((outputArray, smallArray) => outputArray.concat(smallArray), []);

  const applyDiscount =
    checkedItems.filter(item => discountQualifiers.includes(item)).length > 1;

  const backendTotal = checkedItems
    .map(
      applyDiscount
        ? thisItemId => discountedPrices[thisItemId]
        : thisItemId => standardPrices[thisItemId]
    )
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
