import {
  // TOGGLE_CHECKBOX,
  CHECK_CHECKBOX,
  UNCHECK_CHECKBOX
} from '../actions/types';

const empty = {
  idClerambault: [],
  idMulan: [],
  idZilan: []
};

// checked: {
//   idClerambault: ['r0'],
//   idMulan: ['r5', 'r6'],
//   idZilan: ['r3']
// }

export default function(state = empty, action) {
  switch (action.type) {
    case CHECK_CHECKBOX:
      return {
        ...state,
        [action.userId]: [].concat(state[action.userId], action.itemId)
      };
    case UNCHECK_CHECKBOX:
      return {
        ...state,
        [action.userId]: state[action.userId].filter(
          thisBox => action.itemId !== thisBox
        )
      };

    default:
      return state;
  }
}
