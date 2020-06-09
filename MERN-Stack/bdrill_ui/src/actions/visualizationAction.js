import { BackendInstance } from '../config/axiosInstance';
import {
    VIS_TACTICS_FOUND, VIS_TACTICS_NOT_FOUND,
    VIS_ASSIGNMENTS_ATTEMPTED_STATUS_FOUND, VIS_ASSIGNMENTS_ATTEMPTED_STATUS_NOT_FOUND,
    VIS_ASSIGNMENTS_HISTORY_FOUND, VIS_ASSIGNMENTS_HISTORY_NOT_FOUND,
    VIS_MITRE_PERFORMANCE_FOUND, VIS_MITRE_PERFORMANCE_NOT_FOUND,
    VIS_PERFORMANCE_FOUND, VIS_PERFORMANCE_NOT_FOUND,
    VIS_SESSIONS_FOUND, VIS_SESSIONS_NOT_FOUND,
    VIS_MANAGER_ASSIGNMENTS_ATTEMPTED_STATUS_FOUND, VIS_MANAGER_ASSIGNMENTS_ATTEMPTED_STATUS_NOT_FOUND,
    VIS_MANAGER_ASSIGNMENTS_HISTORY_FOUND, VIS_MANAGER_ASSIGNMENTS_HISTORY_NOT_FOUND,
    VIS_ADMIN_PLATFORMS_FOUND, VIS_ADMIN_PLATFORMS_NOT_FOUND


} from './types';
import { setAlert } from './alertAction'

export const tacticsBarGraph = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
    const res = await BackendInstance.post('/api/visualization/tacticsbargraph', null, config);

    dispatch({
      type:   VIS_TACTICS_FOUND,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: VIS_TACTICS_NOT_FOUND,
    });
  }
}


export const AssignmentHistoryRadarGraph = (userId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  const body = JSON.stringify({user_id: userId});
  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
    const res = await BackendInstance.post('/api/visualization/assignedscenariosandcampaignsradarchart', body, config);

    dispatch({
      type:   VIS_ASSIGNMENTS_HISTORY_FOUND,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: VIS_ASSIGNMENTS_HISTORY_NOT_FOUND,
    });
  }
}


export const SessionsBubbleGraph = (userId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    const body = JSON.stringify({user_id: userId});
    const res = await BackendInstance.post('/api/visualization/sessionsbubblechart', body, config);

    dispatch({
      type:   VIS_SESSIONS_FOUND,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: VIS_SESSIONS_NOT_FOUND,
    });
  }
}



export const PerformanceLineGraph = (userId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    const body = JSON.stringify({user_id: userId});
    const res = await BackendInstance.post('/api/visualization/performancelinechart', body, config);

    dispatch({
      type:   VIS_PERFORMANCE_FOUND,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: VIS_PERFORMANCE_NOT_FOUND,
    });
  }
}


export const AssignmentAttemptionStatusDoughnutGraph = (userId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    const body = JSON.stringify({user_id: userId});
    const res = await BackendInstance.post('/api/visualization/assignmentsstatusdoughnutchart', body, config);

    dispatch({
      type:   VIS_ASSIGNMENTS_ATTEMPTED_STATUS_FOUND,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: VIS_ASSIGNMENTS_ATTEMPTED_STATUS_NOT_FOUND,
    });
  }
}


export const MitrePerformanceVisitLineGraph = (userId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    const body = JSON.stringify({user_id: userId});
    const res = await BackendInstance.post('/api/visualization/mitreperformancevisitlinechart', body, config);

    dispatch({
      type:   VIS_MITRE_PERFORMANCE_FOUND,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: VIS_MITRE_PERFORMANCE_NOT_FOUND,
    });
  }
}

/*
Manager Visualazation starts from here.
*/

export const ManagerAssignmentHistoryRadarGraph = (userId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  const body = JSON.stringify({user_id: userId});
  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
    const res = await BackendInstance.post('/api/visualization/managerassignedscenariosandcampaignsradarchart', body, config);

    dispatch({
      type:   VIS_MANAGER_ASSIGNMENTS_HISTORY_FOUND,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: VIS_MANAGER_ASSIGNMENTS_HISTORY_NOT_FOUND,
    });
  }
}

export const ManagerAssignmentAttemptionStatusDoughnutGraph = (userId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    const body = JSON.stringify({user_id: userId});
    const res = await BackendInstance.post('/api/visualization/managerassignmentstatusdoughnutchart', body, config);

    dispatch({
      type:   VIS_MANAGER_ASSIGNMENTS_ATTEMPTED_STATUS_FOUND,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: VIS_MANAGER_ASSIGNMENTS_ATTEMPTED_STATUS_NOT_FOUND,
    });
  }
}

/*
Admin Visualazation starts from here.
*/


export const AdminPlatformsPieChart = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {

    const res = await BackendInstance.post('/api/visualization/adminplatformspiechart', null, config);

    dispatch({
      type:   VIS_ADMIN_PLATFORMS_FOUND,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: VIS_ADMIN_PLATFORMS_NOT_FOUND,
    });
  }
}