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
  const thisUser = await axios.get('/api/current_user');
  // TODO dispatch something if there is no answer from api or from google
  // so that user knows where it's going wrong
  console.log('action: FETCH_USER. thisUser: ', thisUser);
  dispatch({ type: FETCH_USER, payload: thisUser.data });
};

export const handlePayment = payload => async dispatch => {
  const res = await axios.post('/api/payment', payload);
  // console.log(
  //   'ACTION: handlePayment function, before LOAD_RECEIPT action. paymentReceipt: ',
  //   paymentReceipt
  // );
  dispatch(push('/thanks'));
  console.log('res.data.paymentReceipt: ', res.data.paymentReceipt);

  dispatch({ type: LOAD_RECEIPT, payload: res.data.paymentReceipt });
};

export function checkCheckbox(userId, itemId) {
  return {
    type: CHECK_CHECKBOX,
    userId,
    itemId
  };
}

export function uncheckCheckbox(userId, itemId) {
  return {
    type: UNCHECK_CHECKBOX,
    userId,
    itemId
  };
}

export function modifyUser({ userId, fieldName, value }) {
  return {
    type: MODIFY_USER,
    userId,
    fieldName,
    value
  };
}

export function modifyMedia({ index, value }) {
  return {
    type: MODIFY_MEDIA,
    index,
    value
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
    index,
    tags
  };
}
