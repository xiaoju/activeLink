// this reducer is the data that client can modify

import {
  LOAD_DATA,
  MODIFY_MEDIA,
  MODIFY_USER,
  ADD_MEDIA_ROW,
  ADD_ROW,
  ADD_KID_ROW,
  ADD_PARENT_ROW
} from '../actions/types';

import * as Immutable from '../utils/Immutable';
import * as Validation from '../utils/Validation';

const empty = {
  allKids: [],
  allParents: [],
  familyMedia: [],
  familyPerId: {}
};

// receive from action.payload:
// const input = {
//   checkboxUsers: ['7jhfbasd8jfhbeas8', 'MulanBush', 'ZilanPolanski'],
//   parents: ['DonaldBush', 'RosemaryPolanski'],
//   familyEMails: [
//     { it: 'donald@xiaoju.io', tags: ['Donald', 'private'] },
//     { it: 'rosemary@xiaoju.io', tags: ['Rosemary', 'pro'] }
//   ],
//   familyPhones: [
//     { it: '0600000000', tags: ['mobile', 'Donald'] },
//     { it: '0611111111', tags: ['mobile', 'pro', 'Rosemary'] },
//     { it: '0622222222', tags: ['mobile', 'private', 'Rosemary'] },
//     { it: '0633333333', tags: ['landline', 'family'] }
//   ],
//   familyMembers: {
//     DonaldBush: {
//       id: 'DonaldBush',
//       firstName: 'Donald',
//       familyName: 'Bush'
//     },
//     RosemaryPolanski: {
//       id: 'RosemaryPolanski',
//       firstName: 'Rosemary',
//       familyName: 'Polanski'
//     },
//     MulanBush: {
//       id: 'MulanBush',
//       firstName: 'Mulan',
//       familyName: 'Bush',
//       kidGrade: 'CE2'
//     },
//     ZilanPolanski: {
//       id: 'ZilanPolanski',
//       firstName: 'Zilan',
//       familyName: 'Polanski',
//       kidGrade: 'GS'
//     }
//   }
// };
//
// const outputDraft = {
//   kids: ['MulanBush', 'ZilanPolanski'],
//   parents: ['DonaldBush', 'RosemaryPolanski'],
//   familyMembers: {
//     DonaldBush: {
//       id: 'DonaldBush',
//       firstName: 'Donald',
//       familyName: 'Bush'
//     },
//     RosemaryPolanski: {
//       id: 'RosemaryPolanski',
//       firstName: 'Rosemary',
//       familyName: 'Polanski'
//     },
//     MulanBush: {
//       id: 'MulanBush',
//       firstName: 'Mulan',
//       familyName: 'Bush',
//       kidGrade: 'CE2'
//     },
//     ZilanPolanski: {
//       id: 'ZilanPolanski',
//       firstName: 'Zilan',
//       familyName: 'Polanski',
//       kidGrade: 'GS'
//     }
//   },
//   familyEmails: [
//     { it: 'donald@xiaoju.io', tags: ['Donald', 'private'] },
//     { it: 'rosemary@xiaoju.io', tags: ['Rosemary', 'pro'] }
//   ],
//   familyPhones: [
//     { it: '0600000000', tags: ['mobile', 'Donald'] },
//     { it: '0611111111', tags: ['mobile', 'pro', 'Rosemary'] },
//     { it: '0622222222', tags: ['mobile', 'private', 'Rosemary'] },
//     { it: '0633333333', tags: ['landline', 'family'] }
//   ]
// };

export default function(
  state = empty,
  { type, payload, userId, kidGrade, fieldName, index, media, value }
) {
  switch (type) {
    case LOAD_DATA:
      if (!payload) return empty;
      else {
        // necessary because action.payload is undefined when logged out
        let { allKids, allParents, familyMedia, familyPerId } = payload;
        const newParentId = 'p' + allParents.length;
        const newKidId = 'k' + allKids.length;
        return {
          ...state,
          allKids: allKids.concat(newKidId),
          allParents: allParents.concat(newParentId),
          familyMedia: familyMedia.concat({
            media: 'more_horiz', // cssmaterialize icon names: 'phone', 'email', 'more_horiz'
            value: '', // 012345678 or abc@gmail.com
            tags: [
              !!familyPerId['p0'] && familyPerId['p0'].firstName,
              'private',
              'mobile'
            ]
          }),
          familyPerId: {
            ...familyPerId,
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

    case MODIFY_USER:
      return {
        ...state,
        familyPerId: {
          ...state.familyPerId,
          [userId]: {
            ...state.familyPerId[userId],
            [fieldName]: value
          }
        }
      };

    case MODIFY_MEDIA:
      // beware familyMedia is an array of objects!
      return {
        ...state,
        familyMedia: Immutable.updateObjectInArray(state.familyMedia, {
          index: index,
          item: {
            media: Validation.validateEmail(value)
              ? 'email'
              : Validation.validateNumber(value) ? 'phone' : 'more_horiz',
            value,
            tags: state.familyMedia[index].tags
          }
        })
      };

    // case ADD_ROW:
    //   switch (payload) {
    //     case 'kid':
    //       const { allKids } = state;
    //       const newKidId = 'k' + allKids.length;
    //       return {
    //         ...state,
    //         allKids: allKids.concat(newKidId),
    //         familyPerId: {
    //           ...state.familyPerId,
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
    //         familyPerId: {
    //           ...state.familyPerId,
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

    case ADD_KID_ROW:
      const { allKids } = state;
      const newKidId = 'k' + allKids.length;
      return {
        ...state,
        allKids: allKids.concat(newKidId),
        familyPerId: {
          ...state.familyPerId,
          [newKidId]: {
            id: newKidId,
            firstName: '',
            familyName: '',
            kidGrade: ' '
          }
        }
      };

    case ADD_PARENT_ROW:
      const { allParents } = state;
      const newParentId = 'p' + allParents.length;
      return {
        ...state,
        allParents: allParents.concat(newParentId),
        familyPerId: {
          ...state.familyPerId,
          [newParentId]: {
            id: newParentId,
            firstName: '',
            familyName: ''
          }
        }
      };

    case ADD_MEDIA_ROW:
      const { familyPerId, familyMedia } = state;
      return {
        ...state,
        familyMedia: familyMedia.concat({
          media: 'more_horiz',
          value: '',
          tags: [
            !!familyPerId['p0'] && familyPerId['p0'].firstName,
            'private',
            'mobile'
          ]
        })
      };

    default:
      return state;
  }
}
