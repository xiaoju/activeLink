import { createSelector } from 'reselect';

// import { createSelectorWithDependencies as createSelector } from 'reselect-tools';
export const getEvent = state => state.event;
export const getEventId = state => state.event.eventId;
export const getEventName = state => state.event.eventName;
export const getEventProviderName = state => state.event.eventProviderName;
export const getEventContacts = state => state.event.eventContacts;
export const getStandardPrices = state => state.event.standardPrices; // [{r0: 30000}, {r1: 23400}, ...]
export const getDiscountedPrices = state => state.event.discountedPrices; // [{r0: 20000}, {r1: 13400}, ...]
export const getMandatoryItems = state => state.event.mandatoryItems;
export const getAllItems = state => state.event.allItems; // ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']
export const getFamilyItems = state => state.event.familyItems;
export const getItemsPerId = state => state.event.itemsPerId;
export const getDiscountQualifiers = state => state.event.discountQualifiers;
export const getStaffPerId = state => state.event.staffPerId;

export const getProfile = state => state.profile;
export const getFamilyMedia = state => state.profile.familyMedia;
export const getFamilyId = state => state.profile.familyId;
export const getAllKids = state => state.profile.allKids; // [k0, k1, k2]
export const getAllParents = state => state.profile.allParents; // ['p0', 'p1']
export const getAllEvents = state => state.profile.allEvents; // ['e0', 'e1']
export const getFamilyPerId = state => state.profile.familyPerId;
export const getEventsById = state => state.profile.eventsById;
export const getUserFamilyName = (state, { userId }) =>
  state.profile.familyPerId[userId].familyName;
export const getFirstName = (state, { userId }) =>
  state.profile.familyPerId[userId].firstName;
export const getKidGrade = (state, { userId }) =>
  state.profile.familyPerId[userId].kidGrade;
export const getMediaObject = (state, { index }) =>
  state.profile.familyMedia[index];

export const getChecked = state => state.checked; // {idClerambault: [r0], idMulan: ['r1', 'r3', 'r5'], ...}

export const getReceipt = state => state.receipt;

// export const getAllUsers = createSelector(
//   [getAllKids, getAllParents],
//   (allKids, allParents) => allKids.concat(allParents) // ['k0', 'k1', 'k2', 'p0', 'p1', 'p2']
// );

// export const getInvalidUsers = createSelector(
//   // format of the output: { 'k0': true, 'k1': true, 'p0': true, 'p1': true}
//   [getAllUsers, getFamilyPerId],
//   (allUsers, familyPerId) => {
//     const isInvalidGrade = function isInvalidGrade(userId) {
//       return (
//         !!familyPerId[userId].kidGrade && familyPerId[userId].kidGrade === ' '
//         // user is a kid (this field is a thing ) AND grade is not set
//         // NB could just run this on allKids, then no need check if kidGrade exists.
//       );
//     };
//
//     const isInvalidFamilyName = function isInvalidFamilyName(userId) {
//       return (
//         familyPerId[userId].familyName === ''
//         // familyName is not set
//       );
//     };
//
//     const isInvalidFirstName = function isInvalidFirstName(userId) {
//       return familyPerId[userId].firstName === '';
//       // firstName is not set
//     };
//
//     const isInvalidUser = function isInvalidUser(userId) {
//       return (
//         isInvalidFirstName(userId) ||
//         isInvalidFamilyName(userId) ||
//         isInvalidGrade(userId)
//       );
//     };
//
//     return allUsers.reduce((obj, userId) => {
//       obj[userId] = isInvalidUser(userId);
//       return obj;
//     }, {});
//   }
// );

export const getValidKids = createSelector(
  [getAllKids, getFamilyPerId],
  (allKids, familyPerId) => {
    const isValidGrade = function isValidGrade(userId) {
      return (
        // !!familyPerId[userId].kidGrade &&
        familyPerId[userId].kidGrade !== ' '
        // user is a kid (this field is a thing ) AND grade is not set
        // NB just running this on allKids, then no need check if kidGrade exists.
      );
    };

    const isValidFamilyName = function isValidFamilyName(userId) {
      return (
        familyPerId[userId].familyName !== ''
        // familyName is not set
      );
    };

    const isValidFirstName = function isValidFirstName(userId) {
      return familyPerId[userId].firstName !== '';
      // firstName is not set
    };

    const isValidUser = function isValidUser(userId) {
      return (
        isValidFirstName(userId) &&
        isValidFamilyName(userId) &&
        isValidGrade(userId)
      );
    };

    return allKids.filter(isValidUser); // ['k0', 'k1']
  }
);

export const getValidParents = createSelector(
  [getAllParents, getFamilyPerId],
  (allParents, familyPerId) => {
    const isValidFamilyName = function isValidFamilyName(userId) {
      return (
        familyPerId[userId].familyName !== '' // familyName is set
      );
    };

    const isValidFirstName = function isValidFirstName(userId) {
      return familyPerId[userId].firstName !== ''; // firstName is set
    };

    const isValidUser = function isValidUser(userId) {
      return isValidFirstName(userId) && isValidFamilyName(userId);
    };

    return allParents.filter(isValidUser); // ['p0', 'p1']
  }
);

export const getValidUsers = createSelector(
  [getValidParents, getValidKids],
  (validParents, validKids) => validKids.concat(validParents)
);

// export const getAllKidsValid = createSelector(
//   [getInvalidUsers, getAllKids],
//   (invalidUsers, allKids) => {
//     let output =
//       allKids // ['k0', 'k1', 'k2']
//         .map(userId => invalidUsers[userId] * 1) // [0,0,1]
//         .reduce((total, item) => total + item, 0) === 0; // sum : 1 // output: true
//     // console.log('output of getAllKidsValid: ', output);
//     return output;
//   }
// );

export const getAllKidsValid = createSelector(
  [getAllKids, getValidKids],
  (allKids, validKids) => allKids.length === validKids.length
);

export const getOneKidMini = createSelector(
  [getValidKids],
  validKids => validKids.length > 0
);

export const getOneParentMini = createSelector(
  [getValidParents],
  validParents => validParents.length > 0
);

// export const getAllParentsValid = createSelector(
//   [getInvalidUsers, getAllParents, getAllUsers],
//   (invalidUsers, allParents) =>
//     allParents // ['p0', 'p1']
//       .map(userId => invalidUsers[userId] * 1) // [0, 0]
//       .reduce((total, item) => total + item, 0) === 0 // 0
// );

export const getAllParentsValid = createSelector(
  [getAllParents, getValidParents],
  (allParents, validParents) => allParents.length === validParents.length
);

export const getLastMediaValid = createSelector(
  // checking that 'last media in the view got a valid value (email or phone)'
  [getFamilyMedia],
  familyMedia => familyMedia[familyMedia.length - 1].media !== 'more_horiz'
);

// export const getAllParentsValid = createSelector(
//   [getAllParents, getValidParents],
//   (allParents, validParents) => allParents.length === validParents.length
// );

// export const getValidKids = createSelector(
//   [getAllKids, getFamilyPerId],
//   (allKids, familyPerId) =>
//     // condition for 'not validated': no first name, or no family name,
//     // or (if this is a kid, which is true if it has a kidGrade property)
//     // empty kidGrade
//     // !(!firstName || !familytName || (!!kidGrade && kidGrade === ' ') )
//     // condition for 'validated': got first name AND got family name and
//     // (if this is a kid, which is true if it has a kidGrade property)
//     // got non empty kidGrade
//     // !!firstName && !!familytName && (!!kidGrade && kidGrade !== ' ')
//     allKids.map(
//       kidId =>
//         // {firstName, parentId, kidGrade} = familyPerId[kidId];
//         ({
//           firstNameCondition: !!familyPerId[kidId].firstName,
//           familyNameCondition: !!familyPerId[kidId].familytName,
//           kidGradeCondition:
//             !!familyPerId[kidId].kidGrade && familyPerId[kidId].kidGrade !== ' '
//         })
//
//       // !!familyPerId[kidId].firstName &&
//       // !!familyPerId[kidId].familytName &&
//       // (!!familyPerId[kidId].kidGrade && familyPerId[kidId].kidGrade !== ' ')
//     )
// );

// export const getValidParents = createSelector (
//   [getAllParents],
//   (allKids) => allKids.map((kidId)=>(
//         const {firstName, parentId, kidGrade} = familyPerId[kidId]
//         return (!!firstName && !!familytName && (!!kidGrade && kidGrade !== ' '))
//     )
// );
//
// export const getAllParentsValid = createSelector(
//   [getAllParents, getValidParents],
//   (allParents, validParents) => allParents.length === validParents.length
// );
// export const getAllParentsValid = createSelector(
//   [getAllParents, getValidKids],
//   (allKids, validKids) =>
//     console.log('validKids: ', validKids) && allKids.length === validKids.length
// );
//
//
//
//
///// END FORM VALIDATION ///

// DON'T DELETE, THIS CODE WILL BE REUSED IN BACKEND
// discountQualifiers should be calculated in backend
// output an array with the items that open right to discount.
// Those are the one that have a field `priceSecondKid`
// export const discountQualifiers = createSelector(
//   [itemsList, items],
//   (itemsList, items) => {
//     // discountQualifiers: list of items that can qualify for discount.
//     let discountQualifiers = itemsList.filter(
//       thisItemId => items[thisItemId].priceSecondKid
//     );
//     return discountQualifiers;
//   }
// );

export const getFamilyAndValidKids = createSelector(
  [getFamilyId, getValidKids],
  (familyId, validKids) =>
    [familyId] // ['familyId']
      .concat(validKids) // ['familyId', 'k0', 'k1']
);

export const getMergedFamilyName = createSelector(
  // extract the family names of all parents from the profile form, filter out
  // doublons, then concatenate string with '-' in between.
  [getValidParents, getFamilyPerId],
  (validParents, familyPerId) =>
    [
      ...new Set(
        // allParents
        validParents
          // .slice(0, -1) // remove item from the 'create new parent' field
          .map(thisParentId => familyPerId[thisParentId].familyName)
      )
    ].join('-')
);

export const getCheckedItems = createSelector(
  // the list of items that are checked by anyone of the users
  // used by OrderSummary component and getTotal and getCheckedItemsNoDoublons
  [getFamilyAndValidKids, getChecked],
  (familyAndValidKids, checked) =>
    familyAndValidKids // [familyId, 'k0', 'k1']
      .map(thisUserId => checked[thisUserId]) // [['r0'], ['r2','r4']], ['r2','r5','r7']]
      .reduce((outputArray, smallArray) => outputArray.concat(smallArray), []) // ['r0','r2','r4','r2','r5','r7']
);

export const getCheckedItemsNoDoublons = createSelector(
  // remove doublons from checkedItems,
  // for use in OrderSummary component, cycling through these items to show only these.
  // TODO could sort the array. Currently the first ones are those first clicked.
  [getCheckedItems],
  checkedItems => [...new Set(checkedItems)]
);

export const getApplyDiscount = createSelector(
  // create the boolean `applyDiscount`. True if discount price is applicable.
  [getFamilyAndValidKids, getDiscountQualifiers, getChecked],
  (familyAndValidKids, discountQualifiers, checked) =>
    familyAndValidKids
      .map(
        userId =>
          checked[userId].filter(checkedItemId =>
            discountQualifiers.includes(checkedItemId)
          ).length
      )
      .reduce((total, amount) => total + amount, 0) > 1
  // Here a detailed breakdown of the logic:
  // B is number of checked checkboxes of this user that are also discountQualifiers.
  // B = thisUserId =>
  //   checked[thisUserId].filter(checkedItemId =>
  //     discountQualifiers.includes(checkedItemId)
  //   ).length;
  // C is number of checked classes that add up towards qualifying for discount
  // C = Object.keys(checked)
  //   .map(thisUserId => B(thisUserId))
  //   .reduce((total, amount) => total + amount);
  // discount shall apply as soon as at least 2 registrations for qualifying classes: C > 1;
);

export const getTotal = createSelector(
  [getCheckedItems, getApplyDiscount, getStandardPrices, getDiscountedPrices],
  (checkedItems, applyDiscount, standardPrices, discountedPrices) =>
    checkedItems // ['r0','r2','r4','r2','r5','r7'] (doublons are kept, e.g. 'r2')
      .map(
        applyDiscount
          ? thisItemId => discountedPrices[thisItemId]
          : thisItemId => standardPrices[thisItemId]
      ) // [30, 100, 250, 450, 150]
      .reduce((outputSum, smallAmount) => outputSum + smallAmount, 0) // the total
);

export const getTotalNotZero = createSelector([getTotal], total => total > 0);

export const getOnePhoneMini = createSelector(
  [getFamilyMedia],
  familyMedia =>
    familyMedia.filter(mediaObject => mediaObject.media === 'phone').length > 0
);

export const getOneEmailMini = createSelector(
  [getFamilyMedia],
  familyMedia =>
    familyMedia.filter(mediaObject => mediaObject.media === 'email').length > 0
);

export const getFormIsValid = createSelector(
  [
    getTotalNotZero,
    getOnePhoneMini,
    getOneEmailMini,
    getOneKidMini,
    getOneParentMini
  ],
  (totalNotZero, onePhoneMini, oneEmailMini, oneKidMini, oneParentMini) => ({
    totalNotZero,
    oneEmailMini,
    onePhoneMini,
    oneParentMini,
    oneKidMini,
    consolidated:
      totalNotZero &&
      onePhoneMini &&
      oneEmailMini &&
      oneKidMini &&
      oneParentMini
  })
);

export const getValidFamilyPerId = createSelector(
  [getValidUsers, getFamilyPerId],
  // (validUsers, familyPerId) => validUsers.map(userId => familyPerId[userId])
  (validUsers, familyPerId) =>
    validUsers.reduce((obj, userId) => {
      obj[userId] = familyPerId[userId];
      return obj;
    }, {})
);

export const getValidMedia = createSelector([getFamilyMedia], familyMedia =>
  familyMedia.filter(
    mediaObject =>
      mediaObject.media === 'phone' || mediaObject.media === 'email'
  )
);

export const getValidChecked = createSelector(
  [getFamilyAndValidKids, getChecked],
  (familyAndValidKids, checked) =>
    familyAndValidKids.reduce((obj, id) => {
      obj[id] = checked[id];
      return obj;
    }, {})
);

export const getMainEmail = createSelector([getFamilyMedia], familyMedia => {
  const foundMediaObject = familyMedia.find(
    mediaObject => mediaObject.media === 'email'
  );
  return !foundMediaObject ? '' : foundMediaObject.value;
});
