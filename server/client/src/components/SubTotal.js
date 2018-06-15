import React from 'react';
import PropTypes from 'prop-types';

function SubTotal(props) {
  return (
    <div>
      <p>
        {props.checked[thisUserId].includes(props.itemId) &&
          (props.applyDiscount
            ? props.discountedPrice / 100
            : props.standardPrice / 100)}
      </p>
    </div>
  );
}

export default SubTotal;

SubTotal.propTypes = {
  itemId: PropTypes.string.isRequired,
  checked: PropTypes.object.isRequired,
  applyDiscount: PropTypes.bool.isRequired,
  discountedPrice: PropTypes.number.isRequired,
  standardPrice: PropTypes.number.isRequired
};
