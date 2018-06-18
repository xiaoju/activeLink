import { combineReducers } from 'redux';
import authReducer from './authReducer';
import dataReducer from './dataReducer';
import profileReducer from './profileReducer';
import checkedReducer from './checkedReducer';

export default combineReducers({
  auth: authReducer,
  data: dataReducer,
  profile: profileReducer,
  checked: checkedReducer
});
