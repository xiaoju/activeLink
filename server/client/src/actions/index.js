import axios from 'axios';
import {
  FETCH_USER,
  LOAD_DATA,
  CHECK_CHECKBOX,
  UNCHECK_CHECKBOX,
  MODIFY_MEDIA,
  MODIFY_USER,
  ADD_ROW,
  ADD_MEDIA_ROW,
  ADD_KID_ROW,
  ADD_PARENT_ROW
} from './types';

export const fetchUser = () => async dispatch => {
  const thisUser = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: thisUser.data });
  const thisData = thisUser.data && (await axios.get('/api/data'));
  dispatch({ type: LOAD_DATA, payload: thisData.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
};

// export const exportSelection = thisSelection => async dispatch => {
//   const thisOrder = await axios.post('/api/receive_selection', thisSelection);
//   dispatch({ type: REVIEW_ORDER, payload: thisOrder.data });
// };

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

// export function addRow({ payload }) {
//   return {
//     type: ADD_ROW,
//     payload
//   };
// }

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
