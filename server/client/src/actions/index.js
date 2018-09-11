import axios from 'axios';
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
  LOAD_DASHBOARD
} from './types';

export const fetchUser = () => async dispatch => {
  try {
    const fetched = await axios.get('/api/current_family');
    // TODO dispatch something if there is no answer from backend or from google
    // so that user knows where it's going wrong
    // console.log('actions/index.js. fetched.data: ', fetched.data);
    dispatch({ type: FETCH_USER, payload: fetched.data });
  } catch (error) {
    console.log(
      'Error by axios GET /api/current_family or by dispatch FETCH_USER : ',
      error
    );
    // dispatch(push('/sorry'));
    dispatch(push('/login')); // TODO add an error message as props: errorMessage
  }
};

export const fetchDashboard = () => async dispatch => {
  try {
    const dashboard = await axios.get('/api/v1/dashboard');
    console.log('dashboard: ', dashboard);
    dispatch({ type: LOAD_DASHBOARD, payload: dashboard.data });
  } catch (err) {
    // if error is auth, then redirect to login with message
    console.log('ERROR: ', err.toString());
  }
};

export const fetchDump = () => async dispatch => {
  try {
    const fetched = await axios.get('/api/v1/dbdump');
    console.log('fetched.data: ', fetched.data);
    dispatch({ type: LOAD_DUMP, payload: fetched.data });
  } catch (error) {
    console.log('Error in axios fetchDump. Error: ', error);
  }
};

export const handlePayment = payload => async dispatch => {
  dispatch(push('/thanks'));
  try {
    // throw 'oops';
    // console.log('payload: ', payload);
    const res = await axios.post('/api/payment', payload);
    dispatch({ type: LOAD_RECEIPT, payload: res.data });
  } catch (error) {
    console.log(
      'error in axios POST /api/payment or LOAD_RECEIPT dispatch: ',
      error
    );
    dispatch(push('/sorry'));
  }

  // console.log('res.data.paymentReceipt: ', res.data.paymentReceipt);
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
