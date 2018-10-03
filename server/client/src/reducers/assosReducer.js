import { FETCH_USER, LOAD_FAMILY } from '../actions/types';

export default function(state = null, { type, payload }) {
  switch (type) {
    case LOAD_FAMILY:
    case FETCH_USER: {
      if (!payload) return null;
      else {
        return payload.assos;
      }
    }

    default:
      return state;
  }
}
