// this reducer is the data that comes from backend and cannot be modified by client

import { LOAD_RECEIPT, FETCH_USER } from '../actions/types';

const empty = null;

export default function(state = empty, { type, payload }) {
  switch (type) {
    case LOAD_RECEIPT:
      return empty;

    case FETCH_USER:
      if (
        !payload || // action.payload is undefined if logged out // TODO can I remove this line?
        !payload.thisEvent // payload.event is null if no event is open for registration,
      ) {
        return empty;
      } else {
        const {
          eventId,
          ofAssos,
          eventName,
          introduction,
          bookingStart,
          bookingEnd,
          eventProviderName,
          assoEmail,
          replyTo,
          emailFrom,
          eventContacts,
          eventSteps,
          classItems,
          allItems,
          volunteeringItems,
          standardPrices,
          discountedPrices,
          discountQualifiers,
          mandatoryItems,
          familyItems,
          installments,
          staffById,
          itemsById
        } = payload.thisEvent;
        return {
          eventId,
          ofAssos,
          eventName,
          introduction,
          bookingStart,
          bookingEnd,
          eventProviderName,
          assoEmail,
          replyTo,
          emailFrom,
          eventContacts,
          eventSteps,
          classItems,
          allItems,
          volunteeringItems,
          standardPrices,
          discountedPrices,
          discountQualifiers,
          mandatoryItems,
          familyItems,
          installments,
          staffById,
          itemsById
        };
      }

    default:
      return state;
  }
}
