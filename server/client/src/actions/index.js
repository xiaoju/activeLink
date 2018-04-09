import axios from 'axios';
import { FETCH_USER, FETCH_EVENTS } from './types';

export const fetchUser = () => async dispatch => {
  const thisUser = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: thisUser.data });
  const thisEvent = thisUser.data && (await axios.get('/api/events'));
  dispatch({ type: FETCH_EVENTS, payload: thisEvent.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data.events });
};
