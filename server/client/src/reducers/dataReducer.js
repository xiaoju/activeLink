import { LOAD_DATA } from '../actions/types';

// const empty = null;

const empty = {
  users: {},
  event: {
    id: '',
    name: '',
    items: [],
    instructions: []
  },
  items: {}
};

export default function(state = empty, action) {
  switch (action.type) {
    case LOAD_DATA:
      return action.payload.data;
    // return action.payload.data || '';
    default:
      return state;
  }
}
