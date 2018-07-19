import { LOAD_RECEIPT } from '../actions/types';

export default function(state = null, { type, payload }) {
  switch (type) {
    case LOAD_RECEIPT: {
      return payload;
    }

    default:
      return state;
  }
}
