

const checked = .....

const { eventsById: {
  e0: {
    standardPrices,
    discountedPrices,
    allKids,
    familyPerId,
    discountQualifiers
  }
} } = require('../models/draftState');


const isValidGrade = function isValidGrade(familyPerId, userId) {
  return (
    // !!familyPerId[userId].kidGrade &&
    familyPerId[userId].kidGrade !== ' '
    // user is a kid (this field is a thing ) AND grade is not set
    // NB just running this on allKids, then no need check if kidGrade exists.
  );
};

const isValidFamilyName = function isValidFamilyName(familyPerId, userId) {
  return (
    familyPerId[userId].familyName !== ''
    // familyName is not set
  );
};

const isValidFirstName = function isValidFirstName(familyPerId, userId) {
  return familyPerId[userId].firstName !== '';
  // firstName is not set
};

const isValidUser = function isValidUser(userId) {
  return (
    isValidFirstName(familyPerId, userId) &&
    isValidFamilyName(familyPerId, userId) &&
    isValidGrade(familyPerId, userId)
  );
};

// const validKids = function validKids(allKids, isValidUser) {
//   return allKids.filter(isValidUser);
// };
let validKids = allKids.filter(isValidUser);

// const familyAndValidKids = function familyAndValidKids(familyId, validKids) {
//   return [familyId].concat(validKids);
// };
let familyAndValidKids = ['family'].concat(validKids);

// const checkedItems = function checkedItems(familyAndValidKids, checked) {
//   return familyAndValidKids // [familyId, 'k0', 'k1']
//     .map(thisUserId => checked[thisUserId]) // [['r0'], ['r2','r4']], ['r2','r5','r7']]
//     .reduce((outputArray, smallArray) => outputArray.concat(smallArray), []); // ['r0','r2','r4','r2','r5','r7']
// };
let checkedItems = familyAndValidKids // [familyId, 'k0', 'k1']
  .map(thisUserId => checked[thisUserId]) // [['r0'], ['r2','r4']], ['r2','r5','r7']]
  .reduce((outputArray, smallArray) => outputArray.concat(smallArray), []);

// const applyDiscount = function(checkedItems, discountQualifiers) {
//   return (
//     checkedItems.filter(item => discountQualifiers.includes(item)).length > 1
//   );
// };
let applyDiscount =
  checkedItems.filter(item => discountQualifiers.includes(item)).length > 1;

export const total = function total(
  checked,
  discountedPrices,
  standardPrices, 
  // applyDiscount,
  allKids,
  familyPerId,
  discountQualifiers
) {
  return checkedItems // ['r0','r2','r4','r2','r5','r7'] (doublons are kept, e.g. 'r2')
    .map(
      applyDiscount
        ? thisItemId => discountedPrices[thisItemId]
        : thisItemId => standardPrices[thisItemId]
    ) // [30, 100, 250, 450, 150]
    .reduce((outputSum, smallAmount) => outputSum + smallAmount, 0); // the total
};
// let total = checkedItems // ['r0','r2','r4','r2','r5','r7'] (doublons are kept, e.g. 'r2')
//   .map(
//     applyDiscount
//       ? thisItemId => discountedPrices[thisItemId]
//       : thisItemId => standardPrices[thisItemId]
//   ) // [30, 100, 250, 450, 150]
//   .reduce((outputSum, smallAmount) => outputSum + smallAmount, 0);
