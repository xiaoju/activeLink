import { LOAD_DATA } from '../actions/types';

// const empty = null;

const empty = {
  users: {},
  event: {
    id: '',
    name: '',
    items: [],
    instructions: [],
    users: []
  },
  items: {}
};

export default function(state = empty, action) {
  switch (action.type) {
    case LOAD_DATA:
      return action.payload || empty;
    // `|| empty` is required in case action.payload is undefined,
    // which is the case when not logged in.
    default:
      return state;
  }
}
