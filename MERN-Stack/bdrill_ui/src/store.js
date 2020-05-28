import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'
import rootReducer from './reducers'   //index.js is the root reducer
import {chatSocketMiddleware} from './middlewares/chatSocketMiddleware'

const initialState = {}
const middleware = [thunk]

 
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware, chatSocketMiddleware)) //... are spread operators 
)

export default store;