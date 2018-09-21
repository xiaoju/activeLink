import {
  LOAD_SELECTION,
  // SELECT_PRIMARY_EMAIL,
  // MODIFY_JSON_PROFILES,
  SELECT_PAYMENT_OPTION
} from '../actions/types';

const empty = {
  selectedAsso: 'a0',
  selectedEvent: 'e0',
  selectedFamily: '',
  paymentOption: null,
  installmentsQuantity: 1
};

export default function(state = empty, { type, payload }) {
  switch (type) {
    // case SELECT_PRIMARY_EMAIL:
    //   return {
    //     ...state,
    //     selectedFamily: payload
    //   };
    //
    // case MODIFY_JSON_PROFILES:
    //   return {
    //     ...state,
    //     jsonProfiles: payload
    //   };

    case LOAD_SELECTION:
      return payload;

    case SELECT_PAYMENT_OPTION:
      return {
        ...state,
        paymentOption: payload.paymentOption,
        installmentsQuantity: payload.installmentsQuantity
      };

    default:
      return state;
  }
}
