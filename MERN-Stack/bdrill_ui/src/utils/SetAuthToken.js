import {BackendInstance}  from '../config/axiosInstance'
const setAuthToken = token => {
  if (token) {
    // axios.defaults.headers.common['x-auth-token'] = token;
    BackendInstance.defaults.headers.common['x-auth-token'] = token;
  } else {
    // delete axios.defaults.headers.common['x-auth-token'];
    delete BackendInstance.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
