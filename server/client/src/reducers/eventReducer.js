// this reducer is the data that comes from backend and cannot be modified by client

import { LOAD_RECEIPT, FETCH_USER } from '../actions/types';

const empty = null;

export default function(state = empty, { type, payload }) {
  // console.log('eventReducer, payload: ', payload);
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
          assoIconLink,
          eventContacts,
          allItems,
          standardPrices,
          discountedPrices,
          discountQualifiers,
          mandatoryItems,
          familyItems,
          staffById,
          itemsById
        } = payload.thisEvent;
        // console.log('assoIconLink: ', assoIconLink);
        // console.log(
        //   'payload.thisEvent.assoIconLink: ',
        //   payload.thisEvent.assoIconLink
        // );
        // console.log('payload.thisEvent: ', payload.thisEvent);
        return {
          eventId,
          eventName,
          eventProviderName,
          assoIconLink,
          eventContacts,
          allItems,
          standardPrices,
          discountedPrices,
          discountQualifiers,
          mandatoryItems,
          familyItems,
          staffById,
          itemsById
        };
      }

    default:
      return state;
  }
}
