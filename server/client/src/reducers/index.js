import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import profileReducer from './profileReducer';
import checkedReducer from './checkedReducer';

export default combineReducers({
  data: dataReducer,
  profile: profileReducer,
  checked: checkedReducer
});
