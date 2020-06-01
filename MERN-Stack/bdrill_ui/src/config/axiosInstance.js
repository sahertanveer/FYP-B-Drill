
import axios from 'axios';
export const uiInstance = axios.create({
    baseURL: 'http://localhost:3000/'

  });
  // export default uiInstance;
  export const BackendInstance = axios.create({
    baseURL: 'http://localhost:5000/'

  });

  export const socketUrl = "http://localhost:5000";