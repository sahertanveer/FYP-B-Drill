import { BackendInstance } from '../config/axiosInstance'
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CHAT_LOGOUT,
  PASS_VERIFY_USER_TO_MIDDLEWARE
} from './types';
import setAuthToken from '../utils/SetAuthToken';

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await BackendInstance.get('/api/authorization');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });

    dispatch({
      type: PASS_VERIFY_USER_TO_MIDDLEWARE,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
 
  }
};

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
  dispatch({
    type: CHAT_LOGOUT,
  });
}