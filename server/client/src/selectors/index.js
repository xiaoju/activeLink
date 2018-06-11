import { createSelector } from 'reselect';
// about 'reselect', see https://github.com/reduxjs/reselect
// and http://www.bentedder.com/creating-computed-properties-react-redux/

const itemsList = state => state.data.event.items;
const items = state => state.data.items;
const checked = state => state.checked;

export const totalObject = createSelector(
  [itemsList, items, checked],
  (itemsList, items, checked) => {
    // A = discountQualifiers: list of items that can qualify for discount.
    let A = itemsList.filter(thisItemId => items[thisItemId].priceSecondKid);

    // B = number of checked checkboxes of this user that are also A items.
    const B = thisUserId =>
      checked[thisUserId].filter(checkedItemId => A.includes(checkedItemId))
        .length;

    // C = number of checked classes that add up towards qualifying for discount
    let C = Object.keys(checked)
      .map(thisUserId => B(thisUserId))
      .reduce((total, amount) => total + amount);

    // discount shall apply as soon as at least 2 registrations for qualifying classes
    let applyDiscount = C > 1;

    let total = 12300;

    return {
      applyDiscount,
      total
    };
  }
);
