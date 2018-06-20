import { createSelector } from 'reselect';
// about 'reselect', see https://github.com/reduxjs/reselect
// and http://www.bentedder.com/creating-computed-properties-react-redux/

export const getFamilyId = state => state.data.familyId;
export const getKids = state => state.profile.kids;

export const getCheckboxUsers = createSelector(
  // ['idClerambault', 'idMulan', 'idZilan']
  [getFamilyId, getKids],
  (familyId, Kids) => [familyId].concat(Kids)
);

export const getStandardPrices = state => state.data.standardPrices; // [{r0: 30000}, {r1: 23400}, ...]
export const getDiscountedPrices = state => state.data.discountedPrices; // [{r0: 20000}, {r1: 13400}, ...]
export const getMandatoryItems = state => state.data.mandatoryItems;
export const getAllItems = state => state.data.allItems; // ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']
const getParents = state => state.data.parents; // ['DonaldBush', 'RosemaryPolanski']
export const getFamilyMembers = state => state.profile.familyMembers;
export const getFamilyItems = state => state.data.familyItems;
export const getItemsPerId = state => state.data.itemsPerId;
export const getDiscountQualifiers = state => state.data.discountQualifiers;
export const getStaff = state => state.data.staff;
export const getEventContacts = state => state.data.eventContacts;

export const getUserFamilyName = (state, props) =>
  state.profile.familyMembers[props.userId].familyName;
export const getFirstName = (state, props) =>
  state.profile.familyMembers[props.userId].firstName;
export const getKidGrade = (state, props) =>
  state.profile.familyMembers[props.userId].kidGrade;

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

export const getChecked = state => state.checked; // {idClerambault: [r0], idMulan: ['r1', 'r3', 'r5'], ...}

export const getMergedFamilyName = createSelector(
  // extract the family names of all parents from the profile form, filter out
  // doublons, then concatenate string with '-' in between.
  [getParents, getFamilyMembers],
  (parents, familyMembers) =>
    [
      ...new Set(
        parents.map(thisParentId => familyMembers[thisParentId].familyName)
      )
    ].join('-')
);

export const getCheckedItems = createSelector(
  // the list of items that are checked by anyone of the users
  // used by OrderSummary component and getTotal and getCheckedItemsNoDoublons
  [getCheckboxUsers, getChecked],
  (checkboxUsers, checked) =>
    checkboxUsers // [familyId, kid1Id, kid2Id]
      .map(thisUserId => checked[thisUserId]) // [['r0'], ['r2','r4']], ['r2','r5','r7']]
      .reduce((outputArray, smallArray) => outputArray.concat(smallArray), []) // ['r0','r2','r4','r2','r5','r7']
);

export const getCheckedItemsNoDoublons = createSelector(
  // remove doublons from checkedItems,
  // for use in OrderSummary component, cycling through these items to show only these.
  // other way would be run a second reducer in parrallel to checkedReducer,
  // to populate the state of OrderSummary view.
  // TODO could sort the array. Currently the first ones are those first clicked.
  [getCheckedItems],
  checkedItems => [...new Set(checkedItems)]
);

export const getApplyDiscount = createSelector(
  // create the boolean `applyDiscount`. True if discount price is applicable.
  [getCheckboxUsers, getDiscountQualifiers, getChecked],
  (checkboxUsers, discountQualifiers, checked) => {
    let output =
      checkboxUsers
        .map(
          thisUserId =>
            checked[thisUserId].filter(checkedItemId =>
              discountQualifiers.includes(checkedItemId)
            ).length
        )
        .reduce((total, amount) => total + amount, 0) > 1;
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
    console.log('getApplyDiscount: running. Ouput: ', output);
    return output;
  }
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

// export const itemsListExport = createSelector(
//   [itemsList],
//   itemsList => itemsList
// );

// export const applicablePriceArray = createSelector(
//   [items, itemsList],
//   (items, itemsList) => {
//     let output2 = 12345;
//     return output2;
//   }
// );

// export const applicablePriceArray = createSelector(
//   [items, itemsList],
//   (items, itemsList) => {
//     // For each itemId, look up within 'items' the applicable price.
//     // Possible prices are priceFamily, priceFirstKid and priceSecondKid. In short:
//     // - if priceFamily exists, just use it.
//     // - if priceSecondKid exists, use it only if applyDiscount is true.
//     // - otherwise use priceFirstKid.
//     // Then, this function, just map it to the array of itemIds: itemsList.
//     // OUTPUT: [{r0: 300}, {r1: 456}, {r3: 324}, ...]
//     let output = itemsList.map(itemId => ({
//       [itemId]:
//         items[itemId].priceFamily ||
//         (!items[itemId].priceSecondKid || !applyDiscount
//           ? items[itemId].priceFirstKid
//           : items[itemId].priceSecondKid)
//     }));
//     return output;
//   }
// );

// export const applicablePriceObject = createSelector(
//   [itemsList, items],
//   (itemsList, items) => {
//     // For each itemId, look up within 'items' the applicable price.
//     // Possible prices are priceFamily, priceFirstKid and priceSecondKid. In short:
//     // - if priceFamily exists, just use it.
//     // - if priceSecondKid exists, use it only if applyDiscount is true.
//     // - otherwise use priceFirstKid.
//     // Then, this function, just map it to the array of itemIds: itemsList.
//     // OUTPUT: [{r0: 300}, {r1: 456}, {r3: 324}, ...]
//     let output = itemsList.reduce((obj, itemId) => {
//       obj[itemId] =
//         items[itemId].priceFamily ||
//         (!items[itemId].priceSecondKid || !applyDiscount
//           ? items[itemId].priceFirstKid
//           : items[itemId].priceSecondKid);
//       return obj;
//     }, {});
//     return output;
//   }
// );

// export const applicablePriceObject = createSelector(
//   [itemsList, items],
//   (itemsList, items) => {
//     // For each itemId, look up within 'items' the applicable price.
//     // Possible prices are priceFamily, priceFirstKid and priceSecondKid. In short:
//     // - if priceFamily exists, just use it.
//     // - if priceSecondKid exists, use it only if applyDiscount is true.
//     // - otherwise use priceFirstKid.
//     // Then, this function, just map it to the array of itemIds: itemsList.
//     // OUTPUT: [{r0: 300}, {r1: 456}, {r3: 324}, ...]
//     let output = itemsList.reduce((obj, itemId) => {
//       obj[itemId] =
//         items[itemId].priceFamily ||
//         (!!items[itemId].priceSecondKid && applyDiscount
//           ? items[itemId].priceSecondKid
//           : items[itemId].priceFirstKid);
//       return obj;
//     }, {});
//     return output;
//   }
// );

// export const applicablePriceObject = createSelector(
//   // For each itemId, look up within 'items' the applicable price.
//   // Possible prices are priceFamily, priceFirstKid and priceSecondKid. In short:
//   // - if priceFamily exists, just use it.
//   // - if priceSecondKid exists, use it only if applyDiscount is true.
//   // - otherwise use priceFirstKid.
//   // Then, this function, just reduce it into an object:
//   // OUTPUT: {{r0: 300}, {r1: 456}, {r3: 324}, ...}
//   [itemsList, items],
//   (itemsList, items) =>
//     itemsList.reduce((obj, itemId) => {
//       obj[itemId] =
//         items[itemId].priceFamily ||
//         (!items[itemId].priceSecondKid || !applyDiscount
//           ? items[itemId].priceFirstKid
//           : items[itemId].priceSecondKid);
//       return { obj, applyDiscount };
//     }, {})
// );

// export const applicablePriceObject = createSelector(
//   // For each itemId, look up within 'items' the applicable price.
//   // Possible prices are priceFamily, priceFirstKid and priceSecondKid. In short:
//   // - if priceFamily exists, just use it.
//   // - if priceSecondKid exists, use it only if applyDiscount is true.
//   // - otherwise use priceFirstKid.
//   // Then, this function, just reduce it into an object:
//   // OUTPUT: {{r0: 300}, {r1: 456}, {r3: 324}, ...}
//   [itemsList, items],
//   (itemsList, items) =>
//     itemsList.reduce((obj, itemId) => {
//       obj[itemId] =
//         items[itemId].priceFamily ||
//         (!!items[itemId].priceSecondKid && applyDiscount
//           ? items[itemId].priceSecondKid
//           : items[itemId].priceFirstKid);
//       return { obj, applyDiscount };
//     }, {})
// );

// export const adjustedItemPrice = createSelector(
//   [items, checked, users],
//   (items, checked, users) => {
//     // For this itemId, look up within 'items' the applicable price.
//     // Possible prices are priceFamily, priceFirstKid and priceSecondKid).
//     // In short:
//     // - if priceFamily exists, just use it.
//     // - if priceSecondKid exists, use it only if applyDiscount is true.
//     // - otherwise use priceFirstKid.
//     const applicablePrice = ({ itemId, items }) =>
//       items[itemId].priceFamily ||
//       (!items[itemId].priceSecondKid || !applyDiscount
//         ? items[itemId].priceFirstKid
//         : items[itemId].priceSecondKid);
//
//     // For this user (e.g. idMulan), take the arrow of checked answers (e.g. [r2, r3, r7] ),
//     // and add to each itemId (e.g. r2, r3 and r7) the applicalble price,
//     // thus creating an array of objects such as [{r2: 123}, {r3: 450}, {r7: 200}].
//     const alpha = (userId, checked, itemId) =>
//       checked.reduce((price, itemId) => {
//         price[itemId] = applicablePrice(itemId);
//         return price;
//       }, {});
//
//     // finally, gamma returns an object of arrays,
//     // where obj[userId][itemId] = Price
//     const gamma = (items, checked, users) =>
//       users.reduce((obj, userId) => {
//         obj[userId] = alpha(userId, checked, itemId);
//         return obj;
//       }, {});
//
//     return gamma(items, checked, users);
//   }
// );
