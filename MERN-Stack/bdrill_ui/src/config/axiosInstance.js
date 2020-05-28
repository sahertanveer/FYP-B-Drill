
import axios from 'axios';
export const uiInstance = axios.create({
    baseURL: 'http://localhost:3000/'

  });
  // export default uiInstance;
  export const BackendInstance = axios.create({
    baseURL: 'http://58.65.201.134:5000/'

  });

  export const socketUrl = "http://58.65.201.134:5000";