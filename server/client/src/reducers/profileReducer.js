import {
  LOAD_DATA,
  MODIFY_MEDIA,
  MODIFY_USER
  // //
  // ADD_PHONE,
  // REMOVE_PHONE,
  // EDIT_PHONE,
  // //
  // ADD_EMAIL,
  // EDIT_EMAIL,
  // REMOVE_PHONE,
  // //
  // ADD_KID,
  // REMOVE_KID,
  // EDIT_KID,
  // //
  // ADD_PARENT,
  // REMOVE_PARENT,
  // EDIT_PARENT
} from '../actions/types';

import * as Immutable from '../utils/Immutable';

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
          allKids: allKids.concat(newKidId),
          allParents: allParents.concat(newParentId),
          familyMedia: familyMedia.concat({
            media: 'more_horiz', // phone, email or any other cssmaterialize icon name
            value: '', // 012345678 or abc@gmail.com
            tags: ['zero']
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
            media,
            value,
            tags: state.familyMedia[index].tags
          }
        })
      };

    default:
      return state;
  }
}
