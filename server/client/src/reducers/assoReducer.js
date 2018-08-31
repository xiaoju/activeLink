import { FETCH_USER } from '../actions/types';

export default function(state = null, { type, payload }) {
  switch (type) {
    case FETCH_USER: {
      if (!payload) return null;
      else {
        return payload.asso;
      }
    }

    default:
      return state;
  }
}
