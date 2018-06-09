import { combineReducers } from 'redux';
import authReducer from './authReducer';
import dataReducer from './dataReducer';
import selectionReducer from './selectionReducer';

export default combineReducers({
  auth: authReducer,
  data: dataReducer,
  selection: selectionReducer
});
