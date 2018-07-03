import { combineReducers } from 'redux';
import eventReducer from './eventReducer';
import profileReducer from './profileReducer';
import checkedReducer from './checkedReducer';

export default combineReducers({
  event: eventReducer,
  profile: profileReducer,
  checked: checkedReducer
});
