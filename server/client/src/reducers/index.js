import { combineReducers } from 'redux';
import eventsReducer from './eventsReducer';
import profileReducer from './profileReducer';
import checkedReducer from './checkedReducer';
import receiptReducer from './receiptReducer';
import dumpReducer from './dumpReducer';
import assoReducer from './assoReducer';
import assosReducer from './assosReducer';

export default combineReducers({
  receipt: receiptReducer,
  events: eventsReducer,
  profile: profileReducer,
  asso: assoReducer,
  assos: assosReducer,
  checked: checkedReducer,
  dump: dumpReducer
});
