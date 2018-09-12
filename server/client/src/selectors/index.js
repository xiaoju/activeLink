import { createSelector } from 'reselect';
import { capitalizeFirstLetter } from '../utils/Tools';

// import { createSelectorWithDependencies as createSelector } from 'reselect-tools';

export const getSelectedAsso = state => state.currentForm.selectedAsso;
export const getSelectedEvent = state => state.currentForm.selectedEvent;
export const getSelectedFamily = state => state.currentForm.selectedFamily;

export const getErrorMessage = state => state.ui.errorMessage;

export const getDashboardIsLoaded = state => state.dashboard.loaded;

export const getAssoEmail = state => state.asso.assoEmail;
export const getReplyTo = state => state.asso.replyTo;
export const getEmailFrom = state => state.asso.emailFrom;
export const getItemsById = state => state.asso.itemsById;
export const getAddress = state => state.asso.address;
export const getAllStaff = state => state.asso.allStaff;
export const getStaffById = state => state.asso.staffById;
export const getOpenEvents = state => state.asso.openEvents;

export const getEventsById = state => state.events.eventsById;
export const getEvent = state => state.events.eventsById.e0;
export const getCurrentRegistrationEvents = state =>
  state.events.currentRegistrationEvents;

export const getEventId = state => state.events.eventsById.e0.eventId;
export const getEventName = state => state.events.eventsById.e0.eventName;
export const getEventProviderName = state => state.asso.eventProviderName;
export const getEventContacts = state =>
  state.events.eventsById.e0.eventContacts;
export const getStandardPrices = state =>
  state.events.eventsById.e0.standardPrices; // [{r0: 30000}, {r1: 23400}, ...]
export const getDiscountedPrices = state =>
  state.events.eventsById.e0.discountedPrices; // [{r0: 20000}, {r1: 13400}, ...]
export const getMandatoryItems = state =>
  state.events.eventsById.e0.mandatoryItems;
export const getAllItems = state => state.events.eventsById.e0.allItems; // ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']
export const getFamilyItems = state => state.events.eventsById.e0.familyItems;
export const getDiscountQualifiers = state =>
  state.events.eventsById.e0.discountQualifiers;
export const getVolunteeringItems = state =>
  state.events.eventsById.e0.volunteeringItems;

export const getProfile = state => state.profile;
export const getAdminAssos = state =>
  !state.profile ? [] : state.profile.roles.admin;
// export const getAdminAssos = state => ['a0', 'a1', 'a2']; // TODO
export const getPrimaryEmail = state => state.profile.primaryEmail;
export const getPhotoConsent = state => state.profile.photoConsent;

// export const getFamilyMedia = state => state.profile.familyMedia;
export const getFamilyMedia = state =>
  !!state.profile ? state.profile.familyMedia : [];

// export const getAddresses = state => state.profile.addresses;
export const getAddresses = state =>
  !!state.profile ? state.profile.addresses : [];

export const getFamilyId = state => state.profile.familyId; // ['familyId']

// export const getAllKids = state => state.profile.allKids; // ['k0', 'k1', 'k2']
export const getAllKids = state =>
  !!state.profile ? state.profile.allKids : []; // ['k0', 'k1', 'k2']

// export const getAllParents = state => state.profile.allParents; // ['p0', 'p1']
export const getAllParents = state =>
  !!state.profile ? state.profile.allParents : []; // ['p0', 'p1']

export const getFamilyById = state => state.profile.familyById;
export const getRegisteredEvents = state => state.profile.registeredEvents;
export const getUserFamilyName = (state, { userId }) =>
  state.profile.familyById[userId].familyName;
export const getFirstName = (state, { userId }) =>
  state.profile.familyById[userId].firstName;
export const getKidGrade = (state, { userId }) =>
  state.profile.familyById[userId].kidGrade;

export const getChecked = state => state.checked; // {idClerambault: [r0], idMulan: ['r1', 'r3', 'r5'], ...}

export const getReceipt = state => state.receipt;

export const getDump = state => state.dump;
export const getRegistrations = state => state.dump.assos[0].registrations;

export const getAssosById = state =>
  !state.assos ? '' : state.assos.assosById;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// createSelector() items

export const getAvailableForRegistrationEvents = createSelector(
  [getCurrentRegistrationEvents, getRegisteredEvents],
  (currentRegistrationEvents, registeredEvents) =>
    currentRegistrationEvents.filter(
      eventId => !registeredEvents.includes(eventId)
    )
);

// export const getAllUsers = createSelector(
//   [getAllKids, getAllParents],
//   (allKids, allParents) => allKids.concat(allParents) // ['k0', 'k1', 'k2', 'p0', 'p1', 'p2']
// );

// export const getInvalidUsers = createSelector(
//   // format of the output: { 'k0': true, 'k1': true, 'p0': true, 'p1': true}
//   [getAllUsers, getFamilyById],
//   (allUsers, familyById) => {
//     const isInvalidGrade = function isInvalidGrade(userId) {
//       return (
//         !!familyById[userId].kidGrade && familyById[userId].kidGrade === ' '
//         // user is a kid (this field is a thing ) AND grade is not set
//         // NB could just run this on allKids, then no need check if kidGrade exists.
//       );
//     };
//
//     const isInvalidFamilyName = function isInvalidFamilyName(userId) {
//       return (
//         familyById[userId].familyName === ''
//         // familyName is not set
//       );
//     };
//
//     const isInvalidFirstName = function isInvalidFirstName(userId) {
//       return familyById[userId].firstName === '';
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
  [getAllKids, getFamilyById],
  (allKids, familyById) => {
    const isValidGrade = function isValidGrade(userId) {
      return (
        // !!familyById[userId].kidGrade &&
        familyById[userId].kidGrade !== ' '
        // user is a kid (this field is a thing ) AND grade is not set
        // NB just running this on allKids, then no need check if kidGrade exists.
      );
    };

    const isValidFamilyName = function isValidFamilyName(userId) {
      return (
        familyById[userId].familyName !== ''
        // familyName is not set
      );
    };

    const isValidFirstName = function isValidFirstName(userId) {
      return familyById[userId].firstName !== '';
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
  [getAllParents, getFamilyById],
  (allParents, familyById) => {
    const isValidFamilyName = function isValidFamilyName(userId) {
      return (
        familyById[userId].familyName !== '' // familyName is set
      );
    };

    const isValidFirstName = function isValidFirstName(userId) {
      return familyById[userId].firstName !== ''; // firstName is set
    };

    const isValidUser = function isValidUser(userId) {
      return isValidFirstName(userId) && isValidFamilyName(userId);
    };

    return allParents.filter(isValidUser); // ['p0', 'p1']
  }
);

export const getFirstValidParentName = createSelector(
  [getValidParents, getFamilyById],
  (validParents, familyById) => {
    const FirstValidParent = familyById[validParents[0]];
    return !FirstValidParent
      ? '__________' // If there is no "validParent" yet
      : FirstValidParent.firstName + ' ' + FirstValidParent.familyName;
  }
);

export const getValidUsers = createSelector(
  [getValidParents, getValidKids],
  (validParents, validKids) => validKids.concat(validParents)
);

export const getValidParentsKids = createSelector(
  // same as getValidUsers, but with parents listed first, used in address tags
  [getValidParents, getValidKids],
  (validParents, validKids) => validParents.concat(validKids)
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
  // checking that last media in the view got a valid value (email or phone)'
  [getFamilyMedia],
  familyMedia => familyMedia[familyMedia.length - 1].media !== 'more_horiz'
);

export const getLastAddressValid = createSelector(
  // checking that the last address got a valid value (not empty string)'
  [getAddresses],
  addresses => addresses[addresses.length - 1].value !== ''
);

// export const getAllParentsValid = createSelector(
//   [getAllParents, getValidParents],
//   (allParents, validParents) => allParents.length === validParents.length
// );

// export const getValidKids = createSelector(
//   [getAllKids, getFamilyById],
//   (allKids, familyById) =>
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
//         // {firstName, parentId, kidGrade} = familyById[kidId];
//         ({
//           firstNameCondition: !!familyById[kidId].firstName,
//           familyNameCondition: !!familyById[kidId].familytName,
//           kidGradeCondition:
//             !!familyById[kidId].kidGrade && familyById[kidId].kidGrade !== ' '
//         })
//
//       // !!familyById[kidId].firstName &&
//       // !!familyById[kidId].familytName &&
//       // (!!familyById[kidId].kidGrade && familyById[kidId].kidGrade !== ' ')
//     )
// );

// export const getValidParents = createSelector (
//   [getAllParents],
//   (allKids) => allKids.map((kidId)=>(
//         const {firstName, parentId, kidGrade} = familyById[kidId]
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
// export const getFamilyAndValidKids = createSelector(
//   [getFamilyId, getValidKids],
//   (familyId, validKids) =>
//     [familyId] // ['familyId']
//       .concat(validKids) // ['familyId', 'k0', 'k1']
// );

export const getMergedFamilyName = createSelector(
  // extract the family names of all parents from the profile form, filter out
  // doublons, then concatenate string with '-' in between.
  [getValidParents, getFamilyById],
  (validParents, familyById) =>
    [
      ...new Set(
        // allParents
        validParents
          // .slice(0, -1) // remove item from the 'create new parent' field
          .map(thisParentId => familyById[thisParentId].familyName)
      )
    ].join('-')
);

export const getCheckedItems = createSelector(
  // the list of items that are checked by anyone of the users
  // includes doublons, freeOfCharge items, volunteering items
  // used by OrderSummary component and getTotal and getCheckedItemsNoDoublons
  [getFamilyAndValidKids, getChecked],
  (familyAndValidKids, checked) =>
    familyAndValidKids // ['familyId', 'k0', 'k1']
      .map(thisUserId => checked[thisUserId]) // [['r0'], ['r2','r4']], ['r2','r5','r7']]
      .reduce((outputArray, smallArray) => outputArray.concat(smallArray), []) // ['r0','r2','r4','r2','r5','r7']
);

export const getCheckedItemsNoDoublons = createSelector(
  // remove doublons from checkedItems and sort in ascending order,
  // for use in OrderSummary component, cycling through these items to show only these.
  [getCheckedItems],
  checkedItems =>
    [...new Set(checkedItems)].sort(
      (i0, i1) => i0.substring(1) - i1.substring(1)
    )
);

export const getApplyDiscount = createSelector(
  [getCheckedItems, getDiscountQualifiers],
  (checkedItems, discountQualifiers) =>
    checkedItems.filter(item => discountQualifiers.includes(item)).length > 1
  // NB checkedItems keeps the doublons ['i0','i2','i4','i2','i5','i7']
);

// export const getApplyDiscount2 = createSelector(
//   // create the boolean `applyDiscount`. True if discount price is applicable.
//   [getFamilyAndValidKids, getDiscountQualifiers, getChecked],
//   (familyAndValidKids, discountQualifiers, checked) =>
//     familyAndValidKids
//       .map(
//         userId =>
//           checked[userId].filter(checkedItemId =>
//             discountQualifiers.includes(checkedItemId)
//           ).length
//       )
//       .reduce((total, amount) => total + amount, 0) > 1
// );
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

export const getTotal = createSelector(
  [
    getCheckedItems,
    getAllItems,
    getApplyDiscount,
    getStandardPrices,
    getDiscountedPrices
  ],
  (checkedItems, classItems, applyDiscount, standardPrices, discountedPrices) =>
    checkedItems // ['i0','i2','i4','i2','i5','i7'] (doublons are kept, e.g. 'r2')
      .filter(itemId => classItems.includes(itemId)) // don't count the volunteering items
      .map(
        applyDiscount
          ? thisItemId => discountedPrices[thisItemId]
          : thisItemId => standardPrices[thisItemId]
      ) // [30, 100, 250, 450, 150] (replace itemId with its price)
      .reduce((outputSum, smallAmount) => outputSum + smallAmount, 0) // the total
);

export const getTotalNotZero = createSelector([getTotal], total => total > 0);

export const getOneAddressMini = createSelector(
  [getAddresses],
  addresses =>
    addresses.filter(addressObject => addressObject.value !== '').length > 0
);

export const getOnePhoneMini = createSelector(
  [getFamilyMedia],
  familyMedia =>
    familyMedia.filter(mediaObject => mediaObject.media === 'phone').length > 0
);

// export const getOneEmailMini = createSelector(
//   [getFamilyMedia],
//   familyMedia =>
//     familyMedia.filter(mediaObject => mediaObject.media === 'email').length > 0
// );

export const getFormIsValid = createSelector(
  [
    getTotalNotZero,
    getOneAddressMini,
    getOnePhoneMini,
    // getOneEmailMini,
    getOneKidMini,
    getOneParentMini
  ],
  (
    totalNotZero,
    oneAddressMini,
    onePhoneMini,
    // oneEmailMini,
    oneKidMini,
    oneParentMini
  ) => ({
    totalNotZero,
    oneAddressMini,
    // oneEmailMini,
    onePhoneMini,
    oneParentMini,
    oneKidMini,
    consolidated:
      totalNotZero &&
      oneAddressMini &&
      onePhoneMini &&
      // oneEmailMini &&
      oneKidMini &&
      oneParentMini
  })
);

export const getValidFamilyById = createSelector(
  [getValidUsers, getFamilyById],
  // (validUsers, familyById) => validUsers.map(userId => familyById[userId])
  (validUsers, familyById) =>
    validUsers.reduce((obj, userId) => {
      obj[userId] = familyById[userId];
      return obj;
    }, {})
);

export const getValidMedia = createSelector([getFamilyMedia], familyMedia =>
  familyMedia.filter(
    mediaObject =>
      mediaObject.media === 'phone' || mediaObject.media === 'email'
  )
);

export const getValidAddresses = createSelector([getAddresses], addresses =>
  addresses.filter(addressObject => addressObject.value !== '')
);

export const getValidChecked = createSelector(
  [getFamilyAndValidKids, getChecked],
  (familyAndValidKids, checked) =>
    familyAndValidKids.reduce((obj, id) => {
      obj[id] = checked[id];
      return obj;
    }, {})
);

// export const getMainEmail = createSelector([getFamilyMedia], familyMedia => {
//   const foundMediaObject = familyMedia.find(
//     mediaObject => mediaObject.media === 'email'
//   );
//   return !foundMediaObject ? '' : foundMediaObject.value;
// });

export const getMediaTagOptions = createSelector(
  [getFamilyById, getValidParents],
  (familyById, validParents) => {
    return validParents // ['p1', 'p3']
      .map(parentId => capitalizeFirstLetter(familyById[parentId].firstName)) // ['Donald', 'Rosemary', '']
      .filter(firstName => !!firstName) // ['Donald', 'Rosemary'] (remove the empty string)
      .map(firstName => ({ value: firstName, label: firstName })) // [{value: 'Donald', label: 'Donald'}, {... ]
      .concat([
        // add the standard tag options:
        { value: 'family', label: 'family' },
        { value: 'personal', label: 'personal' },
        { value: 'pro', label: 'pro' },
        { value: 'mobile', label: 'mobile' },
        { value: 'landline', label: 'landline' }
      ]);
    // and here the output (note the first 2):
    //  [{ value: 'Donald', label: 'Donald' },
    //   { value: 'Rosemary', label: 'Rosemary' },
    //   { value: 'family', label: 'family' },
    //   { value: 'private', label: 'private' },
    //   { value: 'pro', label: 'pro' },
    //   { value: 'mobile', label: 'mobile' },
    //   { value: 'landline', label: 'landline' }]
  }
);

export const getAddressTagOptions = createSelector(
  // see `getMediaTagOptions` for a description of the logic
  [getFamilyById, getValidParentsKids],
  (familyById, validParentsKids) => {
    const validUsersFirstnames = validParentsKids // ['p1', 'p2', 'k0', 'k1']
      .map(parentId => capitalizeFirstLetter(familyById[parentId].firstName)) // ['Donald', 'Rosemary', 'Mulan', 'Zilan', '']
      .filter(firstName => !!firstName) // remove the empty string
      .map(tag => ({ value: tag, label: tag }));
    return [{ value: 'Whole family', label: 'Whole family' }].concat(
      // add the standard tags
      validUsersFirstnames
    );
  }
);

export const getIsVolunteering = createSelector(
  [getValidChecked, getFamilyId, getVolunteeringItems],
  (validChecked, familyId, volunteeringItems) =>
    validChecked[familyId].some(itemId => volunteeringItems.includes(itemId))
);
