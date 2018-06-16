import { LOAD_DATA } from '../actions/types';

const empty = {
  checkboxUsers: [],
  eventId: '',
  eventName: '',
  allItems: [],
  parents: [],
  standardPrices: {},
  discountedPrices: {},
  discountQualifiers: [],
  mandatoryItems: [],
  familyItems: [],
  familyMembers: {},
  users: {},
  family: {},
  event: {
    id: '',
    name: '',
    items: [],
    instructions: [],
    users: []
  },
  items: {}
};

export default function(state = empty, action) {
  switch (action.type) {
    case LOAD_DATA:
      return action.payload || empty;
    // `|| empty` is required in case action.payload is undefined,
    // which is the case when not logged in.
    default:
      return state;
  }
}
