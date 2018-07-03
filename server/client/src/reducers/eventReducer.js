// this reducer is the data that comes from backend and cannot be modified by client

import { LOAD_DATA } from '../actions/types';

const empty = {
  // familyId: null,
  eventId: null, // using eventId to detect if data arrived yet or not from api call
  eventName: '',
  eventProviderName: '',
  allItems: [],
  standardPrices: {},
  discountedPrices: {},
  discountQualifiers: [],
  mandatoryItems: [],
  familyItems: [],
  staffPerId: {},
  itemsPerId: {}
};

export default function(state = empty, { type, payload }) {
  switch (type) {
    case LOAD_DATA:
      if (!payload)
        // action.payload is undefined when logged out
        return empty;
      else {
        const {
          // familyId,
          eventId,
          eventName,
          eventProviderName,
          eventContacts,
          allItems,
          standardPrices,
          discountedPrices,
          discountQualifiers,
          mandatoryItems,
          familyItems,
          staffPerId,
          itemsPerId
        } = payload;
        return {
          // familyId,
          eventId,
          eventName,
          eventProviderName,
          eventContacts,
          allItems,
          standardPrices,
          discountedPrices,
          discountQualifiers,
          mandatoryItems,
          familyItems,
          staffPerId,
          itemsPerId
        };
      }

    default:
      return state;
  }
}
