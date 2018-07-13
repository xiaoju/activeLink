import {
  LOAD_RECEIPT,
  FETCH_USER,
  CHECK_CHECKBOX,
  UNCHECK_CHECKBOX,
  MODIFY_USER,
  ADD_KID_ROW
} from '../actions/types';

const empty = null;

export default function(state = empty, { type, payload }) {
  switch (type) {
    case LOAD_RECEIPT: {
      return empty;
    }

    case FETCH_USER: {
      // create initial state:
      // 1- convert data.familyAndValidKids, from
      // [familyId, 'k0', 'k1']
      // to
      // {familyId: [], k0: [], k1: [], k2: []}
      if (!payload) {
        return empty;
      } else {
        // necessary because action.payload is undefined when logged out
        let { allKids } = payload.profile;
        let { allItems, mandatoryItems, familyItems } = payload.thisEvent;
        let newKidId = 'k' + allKids.length;
        // return [familyId] // ['familyId']
        return ['family']
          .concat(allKids) // ['familyId', 'k0', 'k1']
          .concat(newKidId) // ['familyId', 'k0', 'k1', 'k2']
          .reduce((obj, thisUserId, currentIndex) => {
            obj[thisUserId] = allItems
              // 2- each array will be empty excepted if this item is a
              // mandatory item (it will always stay checked)
              .filter(thisItemId => mandatoryItems.includes(thisItemId))
              .filter(
                // 3- the mandatory item is written only if it is the right type (price per family vs per kid)
                thisMandatoryItemId =>
                  // the first element in ['familyId', 'k0', 'k1', 'k2'] is 'familyId'
                  (currentIndex === 0 &&
                    familyItems.includes(thisMandatoryItemId)) ||
                  (currentIndex !== 0 &&
                    !familyItems.includes(thisMandatoryItemId))
              );
            return obj;
          }, {});
      }
    }

    case ADD_KID_ROW: {
      let newKidId = 'k' + (Object.keys(state).length - 1);
      return {
        ...state,
        [newKidId]: []
      };
    }

    case CHECK_CHECKBOX: {
      let { itemId, userId } = payload;
      return {
        ...state,
        [userId]: [].concat(state[userId], itemId)
      };
    }

    case UNCHECK_CHECKBOX: {
      let { itemId, userId } = payload;
      return {
        ...state,
        [userId]: state[userId].filter(thisBox => itemId !== thisBox)
      };
    }

    case MODIFY_USER: {
      let { userId, fieldName } = payload;
      return {
        ...state,
        [userId]: fieldName === 'kidGrade' ? [] : state[userId]
      };
    }

    default:
      return state;
  }
}
