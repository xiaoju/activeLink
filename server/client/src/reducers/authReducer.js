import { FETCH_USER } from '../actions/types';

const empty = null;

export default function(state = empty, action) {
  console.log('reducer action: ', action);
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;
    // return action.payload;
    default:
      return state;
  }
}
