import uuid from 'uuid/v4';

import {
  FETCH_USER,
  LOAD_RECEIPT,
  UPDATE_TAGS,
  MODIFY_ADDRESS,
  MODIFY_MEDIA,
  MODIFY_USER,
  TOGGLE_PHOTOCONSENT,
  ADD_ADDRESS_ROW,
  ADD_MEDIA_ROW,
  ADD_KID_ROW,
  ADD_PARENT_ROW
} from '../actions/types';

import * as Immutable from '../utils/Immutable';
import * as Validation from '../utils/Validation';

export default function(state = null, { type, payload }) {
  switch (type) {
    case FETCH_USER: {
      // console.log('profileReducer, case FETCH_USER, uuid(): ', uuid());
      // console.log('FETCH_USER action. payload: ', payload);
      // if null, Header will show the login button
      if (!payload) return null;
      else {
        // TODO change this to {} to avoid crash when selector looks up a property of profile.
        // check first that nowhere I use (!state.profile or profile === null ...)
        // payload is undefined when logged out
        let {
          allKids,
          allParents,
          addresses,
          familyMedia,
          familyById
        } = payload.profile;
        let newParentId = uuid();
        let newKidId = uuid();
        return {
          // we add one new (invalid) kid and parent, as field for user to type.
          ...payload.profile,
          allKids: allKids.concat(newKidId),
          allParents: allParents.concat(newParentId),
          addresses: addresses.concat({
            //  [{ value: '1 place du Capitole, 31000 Toulouse FRANCE',
            //   tags: ['whole family'] // ['whole family'] or ['John', 'Maria', 'Mulan'] }]
            // we add an empty row for typing more addresses
            value: '',
            tags: []
            // state.allParents.length > 1 &&
            // !!state.familyById[state.allParents[1]]
            //   ? [state.familyById[state.allParents[1]].firstName]
            //   : []
          }),
          familyMedia: familyMedia.concat({
            // as last row we add an empty row used to type more media
            media: 'more_horiz', // cssmaterialize icon names: 'phone', 'email', 'more_horiz'
            value: '', // 012345678 or abc@gmail.com
            tags: ['personal']
          }),
          familyById: {
            ...familyById,
            [newKidId]: {
              id: newKidId,
              firstName: '',
              familyName: '',
              kidGrade: ' '
            },
            [newParentId]: {
              id: newParentId,
              firstName: '',
              familyName: ''
            }
          }
        };
      }
    }

    case LOAD_RECEIPT: {
      let {
        allKids,
        allParents,
        allRegistered,
        itemsById,
        bookedEvents,
        photoConsent,
        familyById,
        addresses,
        familyMedia,
        allEvents,
        familyRegistrations,
        registeredEvents
      } = payload;
      return {
        ...state,
        allKids,
        allParents,
        allRegistered,
        itemsById,
        bookedEvents,
        photoConsent,
        familyById,
        addresses,
        familyMedia,
        allEvents,
        familyRegistrations,
        registeredEvents
      };
    }

    case MODIFY_USER: {
      let { userId, fieldName, value } = payload;
      return {
        ...state,
        familyById: {
          ...state.familyById,
          [userId]: {
            ...state.familyById[userId],
            [fieldName]: value
          }
        }
      };
    }

    case TOGGLE_PHOTOCONSENT: {
      return {
        ...state,
        photoConsent: !state.photoConsent
      };
    }

    case ADD_KID_ROW: {
      let newKidId = uuid();
      return {
        ...state,
        allKids: state.allKids.concat(newKidId),
        familyById: {
          ...state.familyById,
          [newKidId]: {
            id: newKidId,
            firstName: '',
            familyName: '',
            kidGrade: ' '
          }
        }
      };
    }

    case ADD_PARENT_ROW: {
      let newParentId = uuid();
      return {
        ...state,
        allParents: state.allParents.concat(newParentId),
        familyById: {
          ...state.familyById,
          [newParentId]: {
            id: newParentId,
            firstName: '',
            familyName: ''
          }
        }
      };
    }

    case ADD_ADDRESS_ROW: {
      return {
        ...state,
        addresses: state.addresses.concat({
          value: '',
          tags: []
          // state.allParents.length > 2 &&
          // !!state.familyById[state.allParents[2]]
          //   ? [state.familyById[state.allParents[2]].firstName]
          //   : []
        })
      };
    }

    case ADD_MEDIA_ROW: {
      return {
        ...state,
        familyMedia: state.familyMedia.concat({
          media: 'more_horiz',
          value: '',
          tags: [
            // state.allParents.length > 0 &&
            //   !!state.familyById[state.allParents[0]] &&
            //   state.familyById[state.allParents[0]].firstName,
            'private'
            // 'mobile'
          ]
        })
      };
    }

    case MODIFY_ADDRESS: {
      // beware that `addresses` *is an array* (of objects)!
      let { index, value } = payload;
      return {
        ...state,
        addresses: Immutable.updateObjectInArray(state.addresses, {
          index,
          item: {
            ...state.addresses[index],
            // tags: state.addresses[index].tags,
            value
          }
        })
      };
    }

    case MODIFY_MEDIA: {
      // beware familyMedia is an array of objects!
      let { index, value } = payload;
      return {
        ...state,
        familyMedia: Immutable.updateObjectInArray(state.familyMedia, {
          index,
          item: {
            media: Validation.validateEmail(value)
              ? 'email'
              : Validation.validateNumber(value) ? 'phone' : 'more_horiz',
            value,
            tags: state.familyMedia[index].tags
          }
        })
      };
    }

    case UPDATE_TAGS: {
      // `familyMedia` (resp. `adresses`) is an array of `mediaObjects` (resp. `addressObjects`).
      // index is the index of the mediaObject/addressObject we want to update with new tags.
      //targetArray is the array on which we're working: `familyMedia` or `addresses`
      let { targetArray, index, tags } = payload;
      return {
        ...state,
        [targetArray]: Immutable.updateObjectInArray(state[targetArray], {
          index,
          item: {
            ...state[targetArray][index],
            tags
          }
        })
      };
    }

    default:
      return state;
  }
}
