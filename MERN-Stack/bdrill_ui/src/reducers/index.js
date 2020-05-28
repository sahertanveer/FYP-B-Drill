import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import authReducer from './authReducer'
import pageReducer from './pageReducer'
import userReducer from './userReducer'
import profileReducer from './profileReducer'
import attackReducer from './attackReducer'
import visualizationReducer from './visualizationReducer'
import chatSocketReducer from './chatSocketReducer'

export default combineReducers({
  alert: alertReducer,
  auth: authReducer,
  user:userReducer,
  page: pageReducer,
  profile:profileReducer,
  attack:attackReducer,
  visualization:visualizationReducer,
  chat:chatSocketReducer
});