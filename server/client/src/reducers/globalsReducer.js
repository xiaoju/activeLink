import { UPDATE_DISCOUNT } from '../actions/types';

const empty = {
  applyDiscount: false
};

export default function(state = empty, action) {
  switch (action.type) {
    case UPDATE_DISCOUNT:
      return {
        applyDiscount: action.discountStatus
      };

    default:
      return state;
  }
}
