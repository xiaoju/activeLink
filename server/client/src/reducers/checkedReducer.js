import { LOAD_DATA, CHECK_CHECKBOX, UNCHECK_CHECKBOX } from '../actions/types';

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
    case LOAD_DATA:
      // create initial state:
      // 1- convert data.checkboxUsers: [familyId, kid1Id, kid2Id] to {familyId: [], kid1Id: [], kid1Id: []}
      return action.payload.checkboxUsers.reduce(
        (obj, thisUserId, currentIndex) => {
          obj[thisUserId] = action.payload.allItems
            // 2- the array will be empty excepted if this item is a mandatory item (it's always checked)
            .filter(thisItemId =>
              action.payload.mandatoryItems.includes(thisItemId)
            )
            .filter(
              // 3- the mandatory item is written only if it is the right type (price per family vs per kid)
              thisMandatoryItemId =>
                // the first element in [familyId, kid1Id, kid2Id] is always the familyId
                (currentIndex === 0 &&
                  action.payload.familyItems.includes(thisMandatoryItemId)) ||
                (currentIndex !== 0 &&
                  !action.payload.familyItems.includes(thisMandatoryItemId))
            );
          return obj;
        },
        {}
      );

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
