import { combineReducers } from 'redux';
import eventReducer from './eventReducer';
import profileReducer from './profileReducer';
import checkedReducer from './checkedReducer';
import receiptReducer from './receiptReducer';

export default combineReducers({
  receipt: receiptReducer,
  event: eventReducer,
  profile: profileReducer,
  checked: checkedReducer
});
