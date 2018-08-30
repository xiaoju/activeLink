import { LOAD_DUMP } from '../actions/types';

export default function(state = null, { type, payload }) {
  switch (type) {
    case LOAD_DUMP: {
      return payload.dbDump;
    }

    default:
      return state;
  }
}
