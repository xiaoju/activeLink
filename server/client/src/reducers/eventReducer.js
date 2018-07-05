// this reducer is the data that comes from backend and cannot be modified by client

import { LOAD_RECEIPT, FETCH_USER } from '../actions/types';

const empty = null;

export default function(state = empty, { type, payload }) {
  switch (type) {
    case LOAD_RECEIPT:
      return empty;

    case FETCH_USER:
      if (!payload)
        // action.payload is undefined when logged out
        return empty;
      else {
        const {
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
        } = payload.eventsById.e0;
        return {
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
