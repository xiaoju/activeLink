import axios from 'axios';
import * as ActiveLinkAPI from '../utils/ActiveLinkAPI';
import { push } from 'connected-react-router';
import {
  FETCH_USER,
  LOAD_RECEIPT,
  CHECK_CHECKBOX,
  UNCHECK_CHECKBOX,
  TOGGLE_PHOTOCONSENT,
  UPDATE_TAGS,
  MODIFY_ADDRESS,
  MODIFY_MEDIA,
  MODIFY_USER,
  ADD_ADDRESS_ROW,
  ADD_MEDIA_ROW,
  ADD_KID_ROW,
  ADD_PARENT_ROW,
  LOAD_DUMP,
  LOAD_DASHBOARD,
  SELECT_PRIMARY_EMAIL,
  SELECT_PAYMENT_OPTION,
  LOAD_FAMILY
} from './types';

export const loadFamily = payload => ({
  type: LOAD_FAMILY,
  payload
});

export const fetchUser = () => async dispatch => {
  console.log('action/index.js fetchUser()');
  let fetched;
  try {
    fetched = await ActiveLinkAPI.fetchFamily();
    // TODO dispatch something if there is no answer from backend
    // so that user knows where it's going wrong
  } catch (error) {
    // console.log('Error by ActiveLinkAPI.fetchFamily(): ', error);

    if (error.response && error.response.status === 401) {
      dispatch(push('/login'));
    } else {
      // dispatch(push('/sorry'));
      dispatch(push('/login/fetchError'));
    }
  }

  try {
    if (fetched && fetched.data) {
      dispatch({ type: FETCH_USER, payload: fetched.data });
    }
  } catch (err) {
    dispatch(push('/login/fetchDispatchError'));
  }
};

export const loadDashboard = () => async dispatch => {
  try {
    const dashboard = await ActiveLinkAPI.fetchDashboard();
    dispatch({ type: LOAD_DASHBOARD, payload: dashboard.data });
  } catch (err) {
    console.log('ERROR: ', err.toString());
  }
};

export const fetchDump = () => async dispatch => {
  try {
    const fetched = await axios.get('/api/v1/dbdump');
    dispatch({ type: LOAD_DUMP, payload: fetched.data });
  } catch (error) {
    console.log('Error in axios fetchDump. Error: ', error);
  }
};

export const handlePayment = payload => async dispatch => {
  dispatch(push('/thanks'));
  try {
    const res = await axios.post('/api/v1/payment', payload);
    dispatch({ type: LOAD_RECEIPT, payload: res.data });
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.frontEndData
    ) {
      console.log('still showing receipt');
      dispatch({
        type: LOAD_RECEIPT,
        payload: error.response.data.frontEndData
      });
    } else {
      console.log('redirect to sorry');
      dispatch(push('/sorry'));
    }
  }
};

export function checkCheckbox(userId, itemId) {
  return {
    type: CHECK_CHECKBOX,
    payload: {
      userId,
      itemId
    }
  };
}

export function uncheckCheckbox(userId, itemId) {
  return {
    type: UNCHECK_CHECKBOX,
    payload: {
      userId,
      itemId
    }
  };
}

export const selectPaymentOption = ({
  paymentOption,
  installmentsQuantity
}) => {
  return {
    type: SELECT_PAYMENT_OPTION,
    payload: {
      paymentOption,
      installmentsQuantity
    }
  };
};

export function togglePhotoConsent() {
  return {
    type: TOGGLE_PHOTOCONSENT
  };
}

export function modifyUser({ userId, fieldName, value }) {
  return {
    type: MODIFY_USER,
    payload: {
      userId,
      fieldName,
      value
    }
  };
}

export function selectPrimaryEmail({ selectedFamily }) {
  return {
    type: SELECT_PRIMARY_EMAIL,
    payload: selectedFamily
  };
}

export function modifyAddress({ index, value }) {
  return {
    type: MODIFY_ADDRESS,
    payload: {
      index,
      value
    }
  };
}

export function modifyMedia({ index, value }) {
  return {
    type: MODIFY_MEDIA,
    payload: {
      index,
      value
    }
  };
}

export function addKidRow() {
  return {
    type: ADD_KID_ROW
  };
}

export function addParentRow() {
  return {
    type: ADD_PARENT_ROW
  };
}

export function addAddressRow() {
  return {
    type: ADD_ADDRESS_ROW
  };
}

export function addMediaRow() {
  return {
    type: ADD_MEDIA_ROW
  };
}

export function updateTags({ targetArray, index, tags }) {
  return {
    type: UPDATE_TAGS,
    payload: {
      targetArray,
      index,
      tags
    }
  };
}
