import { createSelector } from 'reselect';
// about 'reselect', see https://github.com/reduxjs/reselect
// and http://www.bentedder.com/creating-computed-properties-react-redux/

const getData = state => state.data;
const getDiscountQualifiers = state => state.data.discountQualifiers; // ['r1', 'r2']
const getItems = state => state.data.items; // { r0: {priceFamily: 120, ...}, r1 : {...}, ...}
const getStandardPrices = state => state.data.standardPrices; // [{r0: 30000}, {r1: 23400}, ...]
const getDiscountedPrices = state => state.data.discountedPrices; // [{r0: 20000}, {r1: 13400}, ...]

const getItemsArray = createSelector([getData], data => {
  console.log('getItemsArray: running');
  return data.event.items;
});

// const users = state => state.data.event.users; // [idClerambault, idMulan, idZilan]

// discountQualifiers should be calculated in backend
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

export const getApplyDiscount = createSelector(
  [getDiscountQualifiers, getChecked],
  (discountQualifiers, checked) => {
    let output =
      Object.keys(checked)
        .map(
          thisUserId =>
            checked[thisUserId].filter(checkedItemId =>
              discountQualifiers.includes(checkedItemId)
            ).length
        )
        .reduce((total, amount) => total + amount) > 1;
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
  [
    getItemsArray,
    getItems,
    getStandardPrices,
    getDiscountedPrices,
    getApplyDiscount,
    getChecked
  ],
  (
    getItemsArray,
    items,
    standardPrices,
    discountedPrices,
    applyDiscount,
    checked
  ) => {
    console.log('getTotal: running');
    // use twice Array.reduce to make the sum of
    // all the values in the adjustedItemPrice 2D array.
    let total = 12300;

    return total;
  }
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
