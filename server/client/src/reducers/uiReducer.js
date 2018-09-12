import { LOAD_ERROR } from '../actions/types';

const empty = { errorMessage: '' };

export default function(state = empty, { type, payload }) {
  switch (type) {
    case LOAD_ERROR:
      return payload;

    default:
      return state;
  }
}
