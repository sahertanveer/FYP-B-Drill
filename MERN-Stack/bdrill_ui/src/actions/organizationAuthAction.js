import { BackendInstance } from '../config/axiosInstance';
import { loadUser } from './authAction'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  MANAGER_ADDED,
  MANAGER_NOT_ADDED,
  USERS_FOUND,
  USERS_NOT_FOUND,
  MANAGERS_FOUND, 
  MANAGERS_NOT_FOUND,
  USER_DELETED,
  USER_NOT_DELETED,
} from './types';
import { setAlert } from './alertAction'

export const registerOrganization = ({ 
    username, designation, organizationname, address, website, contact, faxnumber, avatar, email, password, year 
}) => async dispatch => {
    const config = {
      headers: {
        'Content-Type': ' application/json ' //application/x-www.form-urlencoded
      }
    }
  
    const newUser = { username, designation, organizationname, address, website, avatar, contact, faxnumber, email, password, year  };
  
    const body = JSON.stringify(newUser);
  
    try {
      // const res = await axios.post('http://115.186.176.139:5000/api/users/register', body, config);
      const res = await BackendInstance.post('/api/organization/registerOrganization', body, config);
  
  
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

export const login = ({ email, password }) => async dispatch => {
    const config = {
      headers: {
        'Content-Type': ' application/json'
      }
    }
  
    const body = JSON.stringify({ email, password });
  
    try {
      const res = await BackendInstance.post('api/organization/login', body, config); 
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

  export const registerManager = ({ organization_id, firstname, middlename, lastname, email, avatar, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': ' application/json ' //application/x-www.form-urlencoded
        }
    }

    const newUser = { organization_id, firstname, middlename, lastname, email, avatar, password };
    const body = JSON.stringify(newUser);

    try {
        const res = await BackendInstance.post('/api/organization/registerManager', body, config);

        console.log(res);

        dispatch({
            type: MANAGER_ADDED,
            payload: res.data
        });

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
        }

        dispatch({
            type: MANAGER_NOT_ADDED

        });
    }
}

//get all managers
export const getmanagers = (organizationId) => async dispatch => {

  try {
      const res = await BackendInstance({
          method: 'post',
          url: '/api/organization/getmanagers',
          data: {
              id: organizationId//'5db080230b62e76104bdd4bd'
          }
      })
      console.log(res.data)

      dispatch({
          type: MANAGERS_FOUND,
          payload: res.data
      });

  } catch (err) {
      const errors = err.response.data.errors;


      if (errors) {

          errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
      }

      dispatch({
          type: MANAGERS_NOT_FOUND


      });
  }
}

//get candidiates
export const getusers = (manager_id) => async dispatch => {

  try {
      const res = await BackendInstance({
          method: 'post',
          url: '/api/organization/getusers',
          data: {
              id: manager_id,
          }
      })
      console.log(res.data)

      dispatch({
          type: USERS_FOUND,
          payload: res.data
      });

  } catch (err) {
      const errors = err.response.data.errors;


      if (errors) {

          errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
      }

      dispatch({
          type: USERS_NOT_FOUND


      });
  }
}

export const deleteCandidate = (id) => async dispatch => {
  if (window.confirm('Do you want to permanently delete Candidate account? This can NOT be undone!')) {
    try {
      {console.log(id)}
      const res = await BackendInstance({
        method: 'post',
        url: '/api/organization/deletecandidate',
        data: {
            _id: id,
        }
    }).then(res=>dispatch(setAlert('User has been permanantly deleted', 'success')))
    .catch(err=> dispatch(setAlert('User not deleted', 'danger')))
     

      
    } catch  {
        dispatch(setAlert('User not deleted', 'danger'));
      };
    }
};

export const deleteManager = (id) => async dispatch => {
  if (window.confirm('Do you want to permanently delete Manager account? This can NOT be undone!')) {
    try {
      {console.log(id)}
      const res = await BackendInstance({
        method: 'post',
        url: '/api/organization/deletemanager',
        data: {
            _id: id,
        }
    }).then(res=>dispatch(setAlert('User has been permanantly deleted', 'success')))
    .catch(err=> dispatch(setAlert('User not deleted', 'danger')))
     

      
    } catch  {
        dispatch(setAlert('User not deleted', 'danger'));
      };
    }
};