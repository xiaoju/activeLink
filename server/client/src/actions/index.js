import axios from 'axios';
import { push } from 'connected-react-router';
import {
  FETCH_USER,
  LOAD_RECEIPT,
  CHECK_CHECKBOX,
  UNCHECK_CHECKBOX,
  UPDATE_TAGS,
  MODIFY_ADDRESS,
  MODIFY_MEDIA,
  MODIFY_USER,
  ADD_ADDRESS_ROW,
  ADD_MEDIA_ROW,
  ADD_KID_ROW,
  ADD_PARENT_ROW
} from './types';

export const fetchUser = () => async dispatch => {
  try {
    const fetched = await axios.get('/api/current_family');
    // TODO dispatch something if there is no answer from backend or from google
    // so that user knows where it's going wrong
    dispatch({ type: FETCH_USER, payload: fetched.data });
  } catch (error) {
    console.log('Error in axios GET /api/current_family: ', error);
    // dispatch(push('/sorry'));
  }
};

export const handlePayment = payload => async dispatch => {
  dispatch(push('/thanks'));
  try {
    // throw 'oops';
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
