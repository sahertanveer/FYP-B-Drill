import {
    PASS_PRIVATE_MESSAGE_USER_TO_MIDDLEWARE,
    PASS_MESSAGE_SENT_TO_MIDDLEWARE,
    PASS_TYPING_TO_MIDDLEWARE,
    SET_ACTIVE_CHAT,
    CHAT_LOGOUT
  } from './types';

  export const passOpenPrivateMessage = (reciever) => dispatch => {
    dispatch({
         type: PASS_PRIVATE_MESSAGE_USER_TO_MIDDLEWARE,
         payload:{
           reciever:reciever
         }
        });
  }

  export const passMessageSent = (message, chatId) => dispatch => {
    dispatch({
         type: PASS_MESSAGE_SENT_TO_MIDDLEWARE,
         payload:{
             message:message,
             chatId: chatId
        }
        });
  }

  export const passTyping = (chatId, isTyping) => dispatch => {
    dispatch({
         type: PASS_TYPING_TO_MIDDLEWARE,
         payload:{
            isTyping:isTyping,
             chatId: chatId
        }
        });
    
    }
    export const setActiveChat = (activeChat) => dispatch => {
        dispatch({
            type: SET_ACTIVE_CHAT,
              payload:activeChat
                });
            
  }

  export const logout=()=>dispatch=>{
    dispatch({
        type:CHAT_LOGOUT
    })
}