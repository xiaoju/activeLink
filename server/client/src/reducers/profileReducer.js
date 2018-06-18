import {
  LOAD_DATA
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

const empty = {};

// receive from action.payload:
const input = {
  checkboxUsers: ['7jhfbasd8jfhbeas8', 'MulanBush', 'ZilanPolanski'],
  parents: ['DonaldBush', 'RosemaryPolanski'],
  familyEMails: [
    { it: 'donald@xiaoju.io', tags: ['Donald', 'private'] },
    { it: 'rosemary@xiaoju.io', tags: ['Rosemary', 'pro'] }
  ],
  familyPhones: [
    { it: '0600000000', tags: ['mobile', 'Donald'] },
    { it: '0611111111', tags: ['mobile', 'pro', 'Rosemary'] },
    { it: '0622222222', tags: ['mobile', 'private', 'Rosemary'] },
    { it: '0633333333', tags: ['landline', 'family'] }
  ],
  familyMembers: {
    DonaldBush: {
      id: 'DonaldBush',
      firstName: 'Donald',
      familyName: 'Bush'
    },
    RosemaryPolanski: {
      id: 'RosemaryPolanski',
      firstName: 'Rosemary',
      familyName: 'Polanski'
    },
    MulanBush: {
      id: 'MulanBush',
      firstName: 'Mulan',
      familyName: 'Bush',
      kidGrade: 'CE2'
    },
    ZilanPolanski: {
      id: 'ZilanPolanski',
      firstName: 'Zilan',
      familyName: 'Polanski',
      kidGrade: 'GS'
    }
  }
};

const outputDraft = {
  kids: ['MulanBush', 'ZilanPolanski'],
  parents: ['DonaldBush', 'RosemaryPolanski'],
  familyMembers: {
    DonaldBush: {
      id: 'DonaldBush',
      firstName: 'Donald',
      familyName: 'Bush'
    },
    RosemaryPolanski: {
      id: 'RosemaryPolanski',
      firstName: 'Rosemary',
      familyName: 'Polanski'
    },
    MulanBush: {
      id: 'MulanBush',
      firstName: 'Mulan',
      familyName: 'Bush',
      kidGrade: 'CE2'
    },
    ZilanPolanski: {
      id: 'ZilanPolanski',
      firstName: 'Zilan',
      familyName: 'Polanski',
      kidGrade: 'GS'
    }
  },
  familyEMails: [
    { it: 'donald@xiaoju.io', tags: ['Donald', 'private'] },
    { it: 'rosemary@xiaoju.io', tags: ['Rosemary', 'pro'] }
  ],
  familyPhones: [
    { it: '0600000000', tags: ['mobile', 'Donald'] },
    { it: '0611111111', tags: ['mobile', 'pro', 'Rosemary'] },
    { it: '0622222222', tags: ['mobile', 'private', 'Rosemary'] },
    { it: '0633333333', tags: ['landline', 'family'] }
  ]
};

export default function(state = empty, action) {
  switch (action.type) {
    case LOAD_DATA:
      let {
        checkboxUsers,
        parents,
        familyEMails,
        familyPhones,
        familyMembers
      } = action.payload;
      let output = {
        kids: checkboxUsers.slice(1),
        parents,
        familyEMails,
        familyPhones
      };

      return output;

    default:
      return state;
  }
}
