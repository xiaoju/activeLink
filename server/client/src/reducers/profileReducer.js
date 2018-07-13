import uuid from 'uuid4';

import {
  FETCH_USER,
  LOAD_RECEIPT,
  UPDATE_TAGS,
  MODIFY_MEDIA,
  MODIFY_USER,
  ADD_MEDIA_ROW,
  ADD_KID_ROW,
  ADD_PARENT_ROW
} from '../actions/types';

import * as Immutable from '../utils/Immutable';
import * as Validation from '../utils/Validation';

export default function(state = null, { type, payload }) {
  switch (type) {
    case FETCH_USER: {
      // console.log('FETCH_USER action. payload: ', payload);
      // if null, Header will show the login button
      if (!payload) return null;
      else {
        // payload is undefined when logged out
        let { allKids, allParents, familyMedia, familyById } = payload.profile;
        // let newParentId = 'p' + allParents.length;
        let newParentId = uuid();
        let newKidId = uuid();
        // let newKidId = 'k' + allKids.length;
        return {
          // we add one new (invalid) kid and parent, as field for user to type.
          ...payload.profile,
          allKids: allKids.concat(newKidId),
          allParents: allParents.concat(newParentId),
          familyMedia: familyMedia.concat({
            media: 'more_horiz', // cssmaterialize icon names: 'phone', 'email', 'more_horiz'
            value: '', // 012345678 or abc@gmail.com
            tags: ['private']
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
        familyById,
        familyMedia,
        allEvents
      } = payload;
      return {
        ...state,
        allKids,
        allParents,
        allRegistered,
        itemsById,
        bookedEvents,
        familyById,
        familyMedia,
        allEvents
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
    // case ADD_ROW:
    //   switch (payload) {
    //     case 'kid':
    //       const { allKids } = state;
    //       const newKidId = 'k' + allKids.length;
    //       return {
    //         ...state,
    //         allKids: allKids.concat(newKidId),
    //         familyById: {
    //           ...state.familyById,
    //           [newKidId]: {
    //             id: newKidId,
    //             firstName: '',
    //             familyName: '',
    //             kidGrade: ' '
    //           }
    //         }
    //       };
    //     case 'parent':
    //       const { allParents } = state;
    //       const newParentId = 'p' + allParents.length;
    //       return {
    //         ...state,
    //         allParents: allParents.concat(newParentId),
    //         familyById: {
    //           ...state.familyById,
    //           [newParentId]: {
    //             id: newParentId,
    //             firstName: '',
    //             familyName: ''
    //           }
    //         }
    //       };
    //     case 'media':
    //       return state;
    //
    //     default:
    //       return state;
    //   }

    case ADD_KID_ROW: {
      // let newKidId = 'k' + state.allKids.length;
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
      // let newParentId = 'p' + state.allParents.length;
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
      // familyMedia is an array of mediaObjects.
      // index is the index of the mediaObject we want to update with new tags.
      // let { familyMedia } = state;
      let { index, tags } = payload;
      return {
        ...state,
        familyMedia: Immutable.updateObjectInArray(state.familyMedia, {
          index,
          item: {
            ...state.familyMedia[index],
            tags
          }
        })
      };
    }

    default:
      return state;
  }
}
