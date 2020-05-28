import { BackendInstance } from '../config/axiosInstance';
import { loadUser } from './authAction'
import {
  LOGIN_SUCCESS, LOGIN_FAIL,
  ATTACKS_FOUND, ATTACKS_NOT_FOUND,
  MACHINE_FOUND, MACHINE_NOT_FOUND,
  PLATFORM_FOUND, PLATFORM_NOT_FOUND,
  ATTACK_ADDED, ATTACK_ERROR,
  MACHINE_ADDED, MACHINE_ERROR,
  PLATFORM_ADDED, PLATFORM_ERROR,
  ORGANIZATION_FOUND, ORGANIZATION_NOT_FOUND,
  USERS_NOT_FOUND, USERS_FOUND, 
  MANAGERS_FOUND, MANAGERS_NOT_FOUND,
} from './types';
import { setAlert } from './alertAction'

export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  const body = JSON.stringify({ email, password });
  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
    const res = await BackendInstance.post('/api/admin/login', body, config);
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

export const getscenariosfromtactic = (category, tacticName, platform) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  const filteredAttacks = { category, tacticName, platform };
  const body = JSON.stringify(filteredAttacks);
  try {
    const res = await BackendInstance.post('/api/attackinventory/getscenariosfromtactic', body, config);

    if (res.data.attacks.length > 0) {
      dispatch({
        type: ATTACKS_FOUND,
        payload: res.data
      });
    }
    else {
      dispatch({
        type: ATTACKS_NOT_FOUND
      });
    }


  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: ATTACKS_NOT_FOUND
    });
  }
}

export const addorupdateattack = ( formData ) => async dispatch => {
  const config = { 
      headers: {
          'Content-Type': ' application/json ' //application/x-www.form-urlencoded
      }
  }

  // const newAttack = { formData };
  // const body = JSON.stringify(newAttack);
  console.log(formData)
  try {
    if(formData.category === "Scenario"){
    const res = await BackendInstance.post('/api/attackinventory/addorupdatescenario', formData, config);
    dispatch({
      type: ATTACK_ADDED,
      payload: res.data
    });
      
      dispatch(setAlert('Scenario Saved', 'success'));
  }
    else{
    const res = await BackendInstance.post('/api/attackinventory/addorupdatecampaign', formData, config);
    dispatch({
      type: ATTACK_ADDED,
      payload: res.data
    });
      
      dispatch(setAlert('Campaign Saved', 'success'));
  }

    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: ATTACK_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  // export const addorupdateattack = ( formData ) => async dispatch => {
  //   const config = { 
  //       headers: {
  //           'Content-Type': ' application/json ' //application/x-www.form-urlencoded
  //       }
  //   }
  
  //   // const newAttack = { formData };
  //   // const body = JSON.stringify(newAttack);
  //   console.log(formData)
  //   try {
  //     // const res =
  //        await BackendInstance.post('/api/attackinventory/addorupdateattack', formData, config)
  //       .then((res) => {
         
  //           console.log(res.data)
  //           dispatch(setAlert("attack added", 'primary'))
  //           // dispatch({
  //           //  type:ATTACK_ADDED,
  //           //   payload: res.data
  //           // });
          
  
  //       }).catch(
  //         dispatch(setAlert("attack not added", 'danger'))
  //       );
        
    
  //       // dispatch(setAlert(edit ? 'Attack Updated' : 'Attack Added', 'success'));
    
  //       // if (!edit) {
  //       //   dispatch({
  //       //       type: ATTACK_UPDATED,
  //       //       payload: res.data
  //       //     });
  //       // }
  //     } catch (err) {
  //       const errors = err.response.data.errors;
    
  //       if (errors) {
  //         errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
  //       }
    
  //       dispatch({
  //         type: ATTACK_ERROR,
  //         // payload: { "error" }
  //       });
  //     }
  //   };

  //get all attacks
export const getallattacks = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    const res = await BackendInstance.post('/api/attackinventory/getallattacks', config);
    dispatch({
      type: ATTACKS_FOUND,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: ATTACKS_NOT_FOUND
    });
  }
}

  export const deleteAttack = (id) => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        // {console.log(id)}
        //  await BackendInstance.post('/api/attackinventory/')
        await BackendInstance({
          method: 'post',
          url: '/api/attackinventory/deleteAttack',
          data: {_id: id}
        })
      .then(res=>dispatch(setAlert('Attack has been permanantly deleted', 'success')))
      .catch(err=> dispatch(setAlert('Attack not deleted', 'danger')))
       
  
        
      } catch  {
          dispatch(setAlert('Attack not deleted', 'danger'));
        };
      }
  };

export const addorupdatemachine = ( formData ) => async dispatch => {
  const config = { 
      headers: {
          'Content-Type': ' application/json ' 
      }
  }

  console.log(formData)
  try {
    const res = await BackendInstance.post('/api/attackinventory/addorupdatemachine', formData, config)

    dispatch({
      type: MACHINE_ADDED,
      payload: res.data
    });
      
      dispatch(setAlert('Machine Saved', 'success'));
      
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: MACHINE_ERROR,
      });
    }
  };

  //get all machines
export const getallmachines = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    const res = await BackendInstance.post('/api/attackinventory/getallmachines', config);
    dispatch({
      type: MACHINE_FOUND,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: MACHINE_NOT_FOUND
    });
  }
}

export const deleteMachine = (id) => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      // {console.log(id)}
      //  await BackendInstance.post('/api/attackinventory/')
      await BackendInstance({
        method: 'post',
        url: '/api/attackinventory/deletemachine',
        data: {_id: id}
      })
    .then(res=>dispatch(setAlert('Machine has been permanantly deleted', 'success')))
    .catch(err=> dispatch(setAlert('Machine not deleted', 'danger')))
     

      
    } catch  {
        dispatch(setAlert('Machine not deleted', 'danger'));
      };
    }
};

export const addorupdateplatform = ( formData ) => async dispatch => {
  const config = { 
      headers: {
          'Content-Type': ' application/json ' 
      }
  }

  console.log(formData)
  try {
    const res = await BackendInstance.post('/api/attackinventory/addorupdateplatform', formData, config)

    dispatch({
      type: PLATFORM_ADDED,
      payload: res.data
    });
      
      dispatch(setAlert('Platform Saved', 'success'));
      
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: PLATFORM_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

  //get all platform
export const getallplatforms = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    const res = await BackendInstance.post('/api/attackinventory/getallplatforms', config);
    dispatch({
      type: PLATFORM_FOUND,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: PLATFORM_NOT_FOUND
    });
  }
}

export const deletePlatform = (id) => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      // {console.log(id)}
      //  await BackendInstance.post('/api/attackinventory/')
      await BackendInstance({
        method: 'post',
        url: '/api/attackinventory/deleteplatform',
        data: {_id: id}
      })
    .then(res=>dispatch(setAlert('Platform has been permanantly deleted', 'success')))
    .catch(err=> dispatch(setAlert('Platform not deleted', 'danger')))
     

      
    } catch  {
        dispatch(setAlert('Platform not deleted', 'danger'));
      };
    }
};
 
//get organizations
export const getorganizations = () => async dispatch => {

  try {
      const res = await BackendInstance({
          method: 'post',
          url: '/api/admin/getorganizations',
      })

      dispatch({
          type: ORGANIZATION_FOUND,
          payload: res.data
      });

  } catch (err) {
      const errors = err.response.data.errors;


      if (errors) {

          errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
      }

      dispatch({
          type: ORGANIZATION_NOT_FOUND
      });
  }
}  

//get managers
export const getmanagers = (organizationId) => async dispatch => {

  try {
      const res = await BackendInstance({
          method: 'post',
          url: '/api/admin/getmanagers',
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
          url: '/api/admin/getusers',
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