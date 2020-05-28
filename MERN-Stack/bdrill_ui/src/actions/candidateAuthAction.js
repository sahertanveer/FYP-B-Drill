import { BackendInstance } from '../config/axiosInstance';
import { loadUser } from './authAction'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  SESSIONS_FOUND,
  SESSIONS_NOT_FOUND,
  EVALUATION_FOUND,
  EVALUATION_NOT_FOUND,
  LOGIN_FAIL
} from './types';
import { setAlert } from './alertAction'

export const register = ({ firstname, lastname, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json ' //application/x-www.form-urlencoded
    }
  }

  const newUser = { firstname, lastname, email, password };

  const body = JSON.stringify(newUser);

  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/users/register', body, config);
    const res = await BackendInstance.post('/api/users/register', body, config);


    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;


    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: REGISTER_FAIL

    });
  }
}

//Login User
export const login = ({ email, password }) => async dispatch => {
  console.log(email)
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }

  const body = JSON.stringify({ email, password });

  try {
    const res = await BackendInstance.post('api/users/login', body, config);  //'http://115.186.176.139:5000/api/users/login'
    console.log("login")
    console.log(res.data)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
}

 //get all attacks
 export const getallsessions = (userId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    // const res = await BackendInstance.post('/api/attacksessions/getusersessions', config);
    const res = await BackendInstance({
      method: 'post',
      url: '/api/attacksessions/getusersessions',
      data: {
        user_id: userId//'5db080230b62e76104bdd4bd'
      }
  })
  console.log(res.data)
    dispatch({
      type: SESSIONS_FOUND,
      payload: res.data
    });
  } catch (err) {
   
    const errors = err.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    
    dispatch({
      type: SESSIONS_NOT_FOUND
    });
  }
}

 //get all sessions details
 export const getsessionsdetail = (attackSessionId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    // const res = await BackendInstance.post('/api/attacksessions/getusersessions', config);
    const res = await BackendInstance({
      method: 'post',
      url: '/api/attacksessions/getdetailedsessionresult',
      data: {
        attack_session_id: attackSessionId//'5db080230b62e76104bdd4bd'
      }
  })
  console.log(res.data)
    dispatch({
      type: EVALUATION_FOUND,
      payload: res.data
    });
  } catch (err) {
   
    const errors = err.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    
    dispatch({
      type: EVALUATION_NOT_FOUND
    });
  }
}