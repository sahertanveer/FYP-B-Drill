import { BackendInstance } from '../config/axiosInstance';
import {
  PASS_SEND_NOTIFICATION_TO_MIDDLEWARE, READ_NOTIFICATION, CANNOT_READ_NOTIFICATION
} from './types';

export const sendNotification = (notification) => async dispatch => {

  dispatch({
    type: PASS_SEND_NOTIFICATION_TO_MIDDLEWARE,
    payload: notification
  });

}

export const readNotification = (id) => async dispatch => {

  const config = {
    headers: {
      'Content-Type': ' application/json ' //application/x-www.form-urlencoded
    }
  }

  const body = JSON.stringify({ notification_id: id });

  try {

    const res = BackendInstance.post('/api/notification/readnotification', body, config);
    //not await because notification should be read if request succeed or not.
    dispatch({
      type: READ_NOTIFICATION,
      payload: id
    });

  }
  catch (err) {
    const errors = err.response.data.errors;

    // if (errors) {
    //     errors.forEach(error => { dispatch(setAlert(error.msg, 'danger')) })
    // }

    dispatch({
      type: CANNOT_READ_NOTIFICATION

    });

  }
}


export const getUserEmail = (user_id, role) => async dispatch => {

  const config = {
    headers: {
      'Content-Type': ' application/json '
    }
  }

  const body = JSON.stringify({ user_id: user_id, role: role });

  try {

    const res = await BackendInstance.post('/api/notification/getuseremail', body, config);
    return { msg: "success", email: res.data.email }

  }
  catch (err) {
    const errors = err.response.data.errors;
    return { msg: "failure" }
  }
}