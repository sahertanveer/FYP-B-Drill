import {
	USER_CONNECTED,
    SET_ACTIVE_CHAT,
    ADD_CHAT,
    UPDATE_USERS_STATUS,
    UPDATE_OFFLINE_STATUS,
    SET_OFFLINE_STATUS,
    SET_CHAT_USER,
    UPDATE_CHAT
  } from '../actions/types';

  const initialState = {
    user: null,
    chats:[],
    users:[],
    offlineUsers:[],
    activeChat:null,
    chatConnected:false,
    usersObj : null

}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_CHAT_USER:
            return {
                ...state,
                user:payload,
                chatConnected:true
            };
        case ADD_CHAT:
        case SET_OFFLINE_STATUS:
        case UPDATE_USERS_STATUS:
            return{
                ...state,
                ...payload
            }
        case UPDATE_OFFLINE_STATUS:
            return{
                ...state,
                offlineUsers:[...state.offlineUsers, payload]
            }
        case UPDATE_CHAT:

            let newChats;
            if(payload.typingChat !==null){
            let tempChats = state.chats
             newChats = tempChats.map(chat=>{
                if(chat.id===payload.ChatId){
                    chat = payload.typingChat
                    // chat.splice(i,1);
                    // chat.splice(i,0,payload.typingChat)
                }
                return chat
            }) 
        }
        else
        newChats = state.chats

            return{
                ...state,
                chats:newChats
            }
        case SET_ACTIVE_CHAT:
            return{
                ...state,
                activeChat:payload
            }
        case USER_CONNECTED:
            return{
                ...state,
                users: payload.users,
                usersObj: payload.usersObj
            }

        default:
            return state;
    }
}