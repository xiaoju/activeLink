import { LOAD_SELECTION, SELECT_PRIMARY_EMAIL } from '../actions/types';

const empty = { selectedAsso: 'a0', selectedEvent: 'e0', selectedFamily: '' };

export default function(state = empty, { type, payload }) {
  switch (type) {
    case SELECT_PRIMARY_EMAIL:
      return {
        ...state,
        selectedFamily: payload
      };

    case LOAD_SELECTION:
      return payload;

    default:
      return state;
  }
}
