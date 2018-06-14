import { UPDATE_TOTAL } from '../actions/types';

const empty = {
  total: 0
};

export default function(state = empty, action) {
  switch (action.type) {
    case UPDATE_TOTAL:
      return {
        total: '23456'
      };

    default:
      return state;
  }
}
