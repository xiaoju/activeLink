import axios from 'axios';
import { push } from 'connected-react-router';
import {
  FETCH_USER,
  LOAD_RECEIPT,
  CHECK_CHECKBOX,
  UNCHECK_CHECKBOX,
  UPDATE_TAGS,
  MODIFY_MEDIA,
  MODIFY_USER,
  ADD_MEDIA_ROW,
  ADD_KID_ROW,
  ADD_PARENT_ROW
} from './types';

export const fetchUser = () => async dispatch => {
  const fetched = await axios.get('/api/current_user');
  // TODO dispatch something if there is no answer from backend or from google
  // so that user knows where it's going wrong
  // console.log('action: FETCH_USER. fetched: ', fetched);
  dispatch({ type: FETCH_USER, payload: fetched.data });
};

export const handlePayment = payload => async dispatch => {
  dispatch(push('/thanks'));
  try {
    const res = await axios.post('/api/payment', payload);
    // console.log('res.data.paymentReceipt: ', res.data.paymentReceipt);
    dispatch({ type: LOAD_RECEIPT, payload: res.data.paymentReceipt });
  } catch (error) {
    console.error(error);
    dispatch(push('/sorry'));
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

export function addMediaRow() {
  return {
    type: ADD_MEDIA_ROW
  };
}

export function updateTags({ index, tags }) {
  return {
    type: UPDATE_TAGS,
    payload: {
      index,
      tags
    }
  };
}
