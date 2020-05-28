import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types'

export const setAlert = (msg, alertType, Timeout = 3000) => 
    dispatch => {
        const id = uuid.v4(); //uuid -> universal id, v4-> version 4(can be any version)
        dispatch({
            type:SET_ALERT,
            payload: { msg, alertType, id }
        });

        setTimeout(() => dispatch({ type:REMOVE_ALERT, payload:id }),Timeout );
}