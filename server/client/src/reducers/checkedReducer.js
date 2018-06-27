import {
  LOAD_DATA,
  CHECK_CHECKBOX,
  UNCHECK_CHECKBOX,
  ADD_KID_ROW
} from '../actions/types';

const empty = null;

export default function(state = empty, { type, payload, userId, itemId }) {
  switch (type) {
    case LOAD_DATA:
      // create initial state:
      // 1- convert data.checkboxUsers: [familyId, kid1Id, kid2Id] to {familyId: [], kid1Id: [], kid2Id: []}
      if (!payload) {
        return empty;
      } else {
        // necessary because action.payload is undefined when logged out
        let {
          familyId,
          allKids,
          allItems,
          mandatoryItems,
          familyItems
        } = payload;
        return [familyId] // ['familyId']
          .concat(allKids) // ['familyId', 'k0', 'k1']
          .reduce((obj, thisUserId, currentIndex) => {
            obj[thisUserId] = allItems
              // 2- the array will be empty excepted if this item is a mandatory item (it's always checked)
              .filter(thisItemId => mandatoryItems.includes(thisItemId))
              .filter(
                // 3- the mandatory item is written only if it is the right type (price per family vs per kid)
                thisMandatoryItemId =>
                  // the first element in [familyId, kid1Id, kid2Id] is always the familyId
                  (currentIndex === 0 &&
                    familyItems.includes(thisMandatoryItemId)) ||
                  (currentIndex !== 0 &&
                    !familyItems.includes(thisMandatoryItemId))
              );
            return obj;
          }, {});
      }

    case ADD_KID_ROW:
      const newKidId = 'k' + (Object.keys(state).length - 1);
      return {
        ...state,
        [newKidId]: []
      };

    case CHECK_CHECKBOX:
      return {
        ...state,
        [userId]: [].concat(state[userId], itemId)
      };

    case UNCHECK_CHECKBOX:
      return {
        ...state,
        [userId]: state[userId].filter(thisBox => itemId !== thisBox)
      };

    default:
      return state;
  }
}
