import { LOAD_RECEIPT } from '../actions/types';

export default function(
  state = null,
  { type, action } // {
) //   type,
//   familyName,
//   familyId,
//   eventId,
//   eventName,
//   invoiceTotal,
//   receiptTimeStamp,
//   last4,
//   paymentStatus,
//   allPurchasedToday
// }
{
  switch (type) {
    case LOAD_RECEIPT: {
      // console.log('RECEIPT REDUCER, payload: ', payload);
      return {
        state
        // ...state,
        // familyName,
        // familyId,
        // eventId,
        // eventName,
        // invoiceTotal,
        // receiptTimeStamp,
        // last4,
        // paymentStatus,
        // allPurchasedToday
      };
    }

    default:
      return state;
  }
}
