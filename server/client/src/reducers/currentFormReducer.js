import {
  FETCH_USER,
  LOAD_SELECTION,
  SELECT_PRIMARY_EMAIL,
  MODIFY_JSON_PROFILES,
  SELECT_PAYMENT_OPTION
} from '../actions/types';

const empty = {
  selectedAsso: 'a0',
  selectedEvent: 'e0',
  selectedFamily: '',
  paymentOption: '',
  installmentsQuantity: 1
};

export default function(state = empty, { type, payload }) {
  switch (type) {
    case FETCH_USER:
      // console.log(
      //   'currentForm reducer, case FETCH_USER, payload.assos',
      //   payload.assos
      // );
      // console.log(
      //   'currentForm reducer, case FETCH_USER, selecteAsso: ',
      //   state.selectedAsso
      // );
      // console.log(
      //   'payload.assos.assosById[state.selectedAsso].paymentPreferences[0]: ',
      //   payload.assos.assosById[state.selectedAsso].paymentPreferences[0]
      // );

      // console.log('currentForm reducer, case FETCH_USER, payload: ', payload);

      if (!payload) {
        return {
          ...state,
          paymentOption: ''
        };
      } else {
        return {
          ...state,
          paymentOption:
            payload.assos.assosById[state.selectedAsso].paymentPreferences[0]
        };
      }

    case SELECT_PRIMARY_EMAIL:
      return {
        ...state,
        selectedFamily: payload
      };

    case MODIFY_JSON_PROFILES:
      return {
        ...state,
        jsonProfiles: payload
      };

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
