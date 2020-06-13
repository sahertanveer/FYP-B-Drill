import { BackendInstance } from '../config/axiosInstance';
import { loadUser } from './authAction'
import {
    CANDIDATE_ADDED,
    CANDIDATE_NOT_ADDED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USERS_FOUND,
    USERS_NOT_FOUND,
    ASSIGNED,
    NOT_ASSIGNED,
    CANDIDATE_NOT_FOUND,
    CANDIDATE_FOUND
} from './types';
import { setAlert } from './alertAction'
import { Result } from 'express-validator';

export const registerCandidate = ({ organization_id, manager_id, firstname, lastname, email }) => async dispatch => {
    const config = { 
        headers: {
            'Content-Type': ' application/json ' //application/x-www.form-urlencoded
        }
    }
    let result = {msg: "failure"}
    const newUser = { organization_id, manager_id, firstname, lastname, email };
    const body = JSON.stringify(newUser);

    try {
        // const res = await axios.post('http://115.186.176.139:5000/api/managers/registerCandidate', body, config);
        const res = await BackendInstance.post('/api/managers/registerCandidate', body, config);
        result.msg="success"
        dispatch({
            type: CANDIDATE_ADDED,
            payload: res.data
        });

    } catch (err) {
        const errors = err.response.data.errors;
        result.msg="failure"
        if (errors) {
            errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
        }

        dispatch({
            type: CANDIDATE_NOT_ADDED

        });
    }
    return result;
}


//get machines wrt platform
// export const getmachines = (platform) => async dispatch => {

//     try {
//         const res = await BackendInstance({
//             method: 'post',
//             url: '/api/managers/getmachines',
//             data: {
//                 platform: platform//'5db080230b62e76104bdd4bd'
//             }
//         })

//         if (Object.keys(res.data).length !==0){

//         dispatch({
//             type: MACHINES_FOUND,
//             payload: res.data
//         });
//     }
//     else{ dispatch({
//         type: MACHINES_NOT_FOUND,
//     });}

//     } catch (err) {
//         const errors = err.response.data.errors;


//         if (errors) {

//             errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
//         }

//         dispatch({
//             type: MACHINES_NOT_FOUND
//         });
//     }
// }


//get all candidates
export const getusers = (managerId) => async dispatch => {

    try {
        const res = await BackendInstance({
            method: 'post',
            url: '/api/managers/getusers',
            data: {
                id: managerId//'5db080230b62e76104bdd4bd'
            }
        })

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

//Login User
export const login = ({ email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': ' application/json'
        }
    }

    const body = JSON.stringify({ email, password });

    try {
        // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
        const res = await BackendInstance.post('/api/managers/login', body, config);
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
            type: LOGIN_FAIL
        });
    }
}


export const addAssignment = (schedule, user_id, manager_id, procedure_id, platform, machine, category, tactic_name) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': ' application/json'
        }
    }

    const body = JSON.stringify({ schedule, user_id, manager_id, procedure_id, platform, machine, category, tactic_name });
    try {
        // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
         await BackendInstance.post('/api/managers/assignattack', body, config)
        .then((res)=>
        {
            dispatch(setAlert("Attack Assigned to candidate successfully", 'primary'))
        }
        )
        dispatch({
            type: ASSIGNED,
        });

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: NOT_ASSIGNED
        });
    }
}

export const checkuser = (user_id) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': ' application/json'
        }
    }

    const body = JSON.stringify({ user_id });

    try {
        // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
        const res = await BackendInstance.post('/api/managers/checkuser', body, config);

        dispatch({
            type: CANDIDATE_FOUND,
            payload: res.data
        });

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {

            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: CANDIDATE_NOT_FOUND
        });
    }
}

export const deleteAssignment = (id) => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
        let result = {msg: "failure"}
      try {
       
        await BackendInstance({
          method: 'post',
          url: '/api/managers/deleteassignment',
          data: {_id: id}
        })
      .then(res=>{
          dispatch(setAlert('Assignment has been permanantly deleted', 'success'));
          result.msg="success"
        })
      .catch(err=> {
          dispatch(setAlert('Assignment not deleted', 'danger'))
          result.msg = "failure";
    })
       
  return result;
      } catch  {
          dispatch(setAlert('Assignment not deleted', 'danger'));
          return result;
        };
      }
  };