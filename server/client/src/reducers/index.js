import { combineReducers } from 'redux';
import authReducer from './authReducer';
import dataReducer from './dataReducer';
// import selectionReducer from './selectionReducer';
import checkedReducer from './checkedReducer';

export default combineReducers({
  auth: authReducer,
  data: dataReducer,
  checked: checkedReducer
  // selection: selectionReducer
});
