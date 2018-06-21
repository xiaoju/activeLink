import { LOAD_DATA } from '../actions/types';

const empty = {
  familyId: null,
  eventId: null, // using eventId to detect if data arrived yet or not from api call
  eventName: '',
  allItems: [],
  standardPrices: {},
  discountedPrices: {},
  discountQualifiers: [],
  mandatoryItems: [],
  familyItems: [],
  staff: {},
  itemsPerId: {}
};

export default function(state = empty, { type, payload }) {
  switch (type) {
    case LOAD_DATA:
      if (!payload)
        // action.payload is undefined when logged out
        return empty;
      else {
        let {
          familyId,
          eventId,
          eventName,
          eventContacts,
          allItems,
          standardPrices,
          discountedPrices,
          discountQualifiers,
          mandatoryItems,
          familyItems,
          staff,
          itemsPerId
        } = payload;
        return {
          familyId,
          eventId,
          eventName,
          eventContacts,
          allItems,
          standardPrices,
          discountedPrices,
          discountQualifiers,
          mandatoryItems,
          familyItems,
          staff,
          itemsPerId
        };
      }

    default:
      return state;
  }
}
