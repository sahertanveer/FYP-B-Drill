import { BackendInstance } from '../config/axiosInstance';
import { setAlert } from './alertAction'

export const deleteCandidate = (id) => async dispatch => {
    if (window.confirm('Do you want to permanently delete Candidate account? This can NOT be undone!')) {
      try {
        {console.log(id)}
        await BackendInstance({
          method: 'post',
          url: '/api/deleteusers/deleteCandidate',
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
        await BackendInstance({
          method: 'post',
          url: '/api/deleteusers/deleteManager',
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
  
  export const deleteOrganization = (id) => async dispatch => {
    if (window.confirm('Do you want to permanently delete Manager account? This can NOT be undone!')) {
      try {
        {console.log(id)}
        await BackendInstance({
          method: 'post',
          url: '/api/deleteusers/deleteOrganization',
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