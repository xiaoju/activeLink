import {
  LOAD_DATA,
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

const empty = {
  kids: [],
  parents: [],
  familyEMails: [],
  familyPhones: [],
  familyMembers: {}
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
  { type, payload, userId, kidGrade, fieldName, value }
) {
  switch (type) {
    case LOAD_DATA:
      if (!payload) return empty;
      else {
        // necessary because action.payload is undefined when logged out
        let {
          kids,
          parents,
          familyEmails,
          familyPhones,
          familyMembers
        } = payload;
        return {
          kids,
          parents,
          familyEmails,
          familyPhones,
          familyMembers
        };
      }

    case MODIFY_USER:
      return {
        ...state,
        familyMembers: {
          ...state.familyMembers,
          [userId]: {
            ...state.familyMembers[userId],
            [fieldName]: value
          }
        }
      };

    default:
      return state;
  }
}
