import { FETCH_USER, LOAD_FAMILY } from '../actions/types';

const empty = null;

export default function(state = empty, { type, payload }) {
  switch (type) {
    case LOAD_FAMILY:
    case FETCH_USER:
      if (
        !payload || // action.payload is undefined if logged out
        !payload.events // just in case, probably can delete this
      ) {
        return empty;
      } else {
        return payload.events;
      }
    default:
      return state;
  }
}
