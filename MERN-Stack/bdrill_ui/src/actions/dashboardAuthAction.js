import { BackendInstance } from '../config/axiosInstance';

//get live sessions
export const getlivesesssionslength = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': ' application/json'
        }
    }

    try {
        const res = await BackendInstance.post('/api/getlength/getinprogresssessions', config)
        return (res.data.sessions);

    } catch {
        return 0;
    }
}
//get Machines length
export const getmachineslength = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': ' application/json'
        }
    }

    try {
        const res = await BackendInstance.post('/api/getlength/getmachineslength', config)
        return (res.data.machines);

    } catch {
        return 0;
    }
}

//get Machines length
export const getattackslength = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': ' application/json'
        }
    }

    try {
        const res = await BackendInstance.post('/api/getlength/getattackslength', config)
        return (res.data.attacks);

    } catch {
        return 0;
    }
}

//get Organizations length
export const getorganizationslength = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': ' application/json'
        }
    }

    try {
        const res = await BackendInstance.post('/api/getlength/getorganizationslength', config)
        return (res.data.organizations);

    } catch {
        return 0;
    }
}

//get managers length
export const getmanagerslength = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': ' application/json'
        }
    }

    try {
        const res = await BackendInstance.post('/api/getlength/getmanagerslength', config)
        return (res.data.managers);
    } catch {
        return 0;
    }
}

//get candidiates length
export const getuserslength = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': ' application/json'
        }
    }

    try {
        const res = await BackendInstance.post('/api/getlength/getuserslength', config)
        return (res.data.users);

    } catch {
        return 0;
    }
}