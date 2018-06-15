import React from 'react';
import PropTypes from 'prop-types';

function ItemPrices({ itemId, familyItems, standardPrices, discountedPrices }) {
  return familyItems.includes(itemId) ? (
    <div>
      Price (per year, per family): {standardPrices[itemId] / 100} &euro;
    </div>
  ) : standardPrices[itemId] === discountedPrices[itemId] ? (
    <div>Price (per year, per kid): {standardPrices[itemId] / 100} &euro;</div>
  ) : (
    <div>
      <div>
        Standard price (per year, per kid): {standardPrices[itemId] / 100}{' '}
        &euro;
      </div>
      <div>
        Discounted price (per year, per kid): {discountedPrices[itemId] / 100}{' '}
        &euro;
      </div>
    </div>
  );
}

export default ItemPrices;

ItemPrices.propTypes = {
  itemId: PropTypes.string.isRequired,
  familyItems: PropTypes.array.isRequired,
  standardPrices: PropTypes.object.isRequired,
  discountedPrices: PropTypes.object.isRequired
};
