import { LOAD_RECEIPT } from '../actions/types';

export default function(state = null, { type, payload }) {
  switch (type) {
    case LOAD_RECEIPT: {
      console.log('LOAD_RECEIPT, payload: ', payload);
      let {
        familyName,
        eventName,
        invoiceTotal,
        receiptTimeStamp,
        last4,
        paymentStatus,
        allPurchasedToday
      } = payload;
      return {
        familyName,
        eventName,
        invoiceTotal,
        receiptTimeStamp,
        last4,
        paymentStatus,
        allPurchasedToday
      };
    }

    default:
      return state;
  }
}
