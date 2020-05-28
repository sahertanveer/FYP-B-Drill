import { BackendInstance } from '../config/axiosInstance';
import { loadUser } from './authAction'
import {
    VIS_TACTICS_FOUND, VIS_TACTICS_NOT_FOUND,
    VIS_ASSIGNMENTS_ATTEMPTED_STATUS_FOUND, VIS_ASSIGNMENTS_ATTEMPTED_STATUS_NOT_FOUND,
    VIS_ASSIGNMENTS_HISTORY_FOUND, VIS_ASSIGNMENTS_HISTORY_NOT_FOUND,
    VIS_MITRE_PERFORMANCE_FOUND, VIS_MITRE_PERFORMANCE_NOT_FOUND,
    VIS_PERFORMANCE_FOUND, VIS_PERFORMANCE_NOT_FOUND,
    VIS_SESSIONS_FOUND, VIS_SESSIONS_NOT_FOUND
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

    console.log(res.data)
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


export const AssignmentHistoryRadarGraph = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
    const res = await BackendInstance.post('/api/visualization/assignedscenariosandcampaignsradarchart', null, config);

    console.log(res.data)
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


export const SessionsBubbleGraph = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
    const res = await BackendInstance.post('/api/visualization/sessionsbubblechart', null, config);

    console.log(res.data)
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



export const PerformanceLineGraph = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
    const res = await BackendInstance.post('/api/visualization/performancelinechart', null, config);

    console.log(res.data)
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


export const AssignmentAttemptionStatusDoughnutGraph = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
    const res = await BackendInstance.post('/api/visualization/assignmentsstatusdoughnutchart', null, config);

    console.log(res.data)
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


export const MitrePerformanceVisitLineGraph = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': ' application/json'
    }
  }
  try {
    // const res = await axios.post('http://115.186.176.139:5000/api/admin/login', body, config);
    const res = await BackendInstance.post('/api/visualization/mitreperformancevisitlinechart', null, config);

    console.log(res.data)
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
