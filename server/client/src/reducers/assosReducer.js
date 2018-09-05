import { FETCH_USER } from '../actions/types';

export default function(state = null, { type, payload }) {
  switch (type) {
    case FETCH_USER: {
      console.log('assosReducer, payload:', payload);
      if (!payload) return null;
      else {
        return payload.assos;
      }
    }

    default:
      return state;
  }
}
