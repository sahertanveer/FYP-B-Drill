import { BackendInstance } from '../config/axiosInstance';
import { setAlert } from './alertAction'


export const forgotPassword = ({ email }) => async dispatch => {
    const config = {
      headers: {
        'Content-Type': ' application/json'
      }
    }
    const body = JSON.stringify({ email });
    try {
      await BackendInstance.post('/api/password/forgotPassword', body, config)
      dispatch(setAlert('Check your mail to reset password', 'success'));
      
    } catch {
        dispatch(setAlert('Email could not sent. Please try again later', 'danger'));
    }
  }

  export const resetPassword = ({  password, token }) => async dispatch => {
      console.log(token)
    const config = {
      headers: {
        'Content-Type': ' application/json',
        'x-auth-token': token 
      }
    }
    const body = JSON.stringify({  password });
    try {
      await BackendInstance.post('/api/password/resetPassword', body, config)
      dispatch(setAlert('Password Reset Successfully', 'success'));
      
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        
          errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
      }
        // dispatch(setAlert('Could not reset password due to session timeout.', 'danger'));
    }
  }

  export const changePassword = ({ _id, password, newpassword }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  const body = JSON.stringify({  _id, password, newpassword });
  try {
    await BackendInstance.post('/api/password/changePassword', body, config)
    dispatch(setAlert('Password changed successfully', 'success'));
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {

        errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
    }
      // dispatch(setAlert('Could not reset password due to session timeout.', 'danger'));
  }
}