import { BackendInstance } from '../config/axiosInstance';
import {
    GET_PROFILE,
    GET_PROFILES,
    GET_USER_ROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
} from './types';
import { setAlert } from './alertAction'
import { loadUser } from './authAction';

export const uploadPhoto = ( file ) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': "multipart/form-data"
    }
  }
  console.log(file + "fgh")
// const body = JSON.stringify( {file: file} );
console.log(  "gdh")
    try {
      await BackendInstance.post('/api/profile/uploadphoto', file, config);
  
      dispatch(setAlert('Image uploaded successfully', 'success'));
      dispatch(loadUser());
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {

        errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
    }
      // dispatch(setAlert('Could not reset password due to session timeout.', 'danger'));
  }
}

export const getProfilePhoto = ( path ) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': "multipart/form-data"
    }
  }
    try {
      await BackendInstance.post('/api/profile/getprofilephoto', path, config);
  
      // dispatch(setAlert('Image uploaded successfully', 'success'));
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {

        errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
    }
      // dispatch(setAlert('Could not reset password due to session timeout.', 'danger'));
  }
}

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
    try {
      const res = await BackendInstance.get('/api/profile/me', config);
  
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err.response
      });
    }
  };
  
  // Get all profiles
  export const getProfiles = (requestedRole, all, id) => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    
    const config = { 
      headers: {
          'Content-Type': ' application/json ' //application/x-www.form-urlencoded
      }
  }
    const body = JSON.stringify({requestedRole: requestedRole, all: all, id: id});
    console.log(body)
    try {
      const res = await BackendInstance.post('/api/profile/getprofiles' , body, config);
      console.log(res.data)
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        // payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Get profile by ID
  export const getProfileById = (role, userId) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const body = JSON.stringify({role:role, userId:userId});
      console.log(userId)
      console.log(role)
      const res = await BackendInstance.post(`/api/profile/getuserprofile`, body, config);
      
      dispatch({
        type: GET_USER_ROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Create or update profile
  export const createorupdateProfile = ( formData, edit = false ) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      const res = await BackendInstance.post('/api/profile', formData, config);
  
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
  
      dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
  
      if (!edit) {
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
          });
      }
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

  // Delete account & profile
export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await BackendInstance.delete('/api/profile');
  
        dispatch({ type: CLEAR_PROFILE });
        dispatch({ type: ACCOUNT_DELETED });
  
        dispatch(setAlert('Your account has been permanantly deleted'));
      } catch (err) {
        dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
      }
    }
  };
  