import { LOAD_DATA } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case LOAD_DATA:
      return action.payload.data || '';
    default:
      return state;
  }
}
