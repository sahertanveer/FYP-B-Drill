import {
    COMMUNITY_CHAT,
    USER_CONNECTED,
    MESSAGE_RECIEVED,
    MESSAGE_SENT,
    USER_DISCONNECTED,
    PASS_TYPING_TO_MIDDLEWARE,
    TYPING,
    VERIFY_USER,
    SET_CHAT_USER,
    PASS_VERIFY_USER_TO_MIDDLEWARE,
    PASS_PRIVATE_MESSAGE_USER_TO_MIDDLEWARE,
    PASS_MESSAGE_SENT_TO_MIDDLEWARE,
    CONNECTION_ESTABLISHED,
    UPDATE_USERS_STATUS,
    UPDATE_OFFLINE_STATUS,
    SET_OFFLINE_STATUS,
    CHAT_LOGOUT,
    LOGOUT,
    PRIVATE_MESSAGE,
    ADD_CHAT,
    UPDATE_CHAT,
    CONNECT,
    NOTIFICATIONS_FOUND, NOTIFICATIONS_NOT_FOUND , PASS_SEND_NOTIFICATION_TO_MIDDLEWARE,
    SEND_NOTIFICATION, RECIEVE_NOTIFICATION, ADD_NOTIFICATION
} from '../actions/types';
import io from 'socket.io-client'
import { values } from 'lodash'
import {socketUrl} from '../config/axiosInstance'


var socket = null

export function chatSocketMiddleware({ getState, dispatch }) {


    if (!getState().chat.chatConnected)
        socket = io(socketUrl)

    socket.on(CONNECT, () => {
        dispatch({
            type: CONNECTION_ESTABLISHED,
            payload: socket
        })

    })

    socket.on(USER_CONNECTED, (users, admins, role) => {

        dispatch({
            type: USER_CONNECTED,
            payload: {
                users: values(users),
                usersObj: users
            }

        })
    })


    socket.on(USER_DISCONNECTED, (users) => {
        let disconnectedUsers = getState().chat.offlineUsers
        let updatedUsers = values(users)
        let found = false
        getState().chat.users.map(usr => {
            found = false
            updatedUsers.map(updatedUsr => {
                if (usr.email === updatedUsr.email)
                    found = true;

            });
            if (!found && !disconnectedUsers.includes(usr.email))
                disconnectedUsers.push(usr.email)  //yahan
        })
        let payload = {
            users: values(users),
            usersObj: users,
            offlineUsers: disconnectedUsers
        }
        dispatch({
            type: UPDATE_USERS_STATUS,
            payload: payload
        })
    })

    socket.on(PRIVATE_MESSAGE, (chat) => {
        addChat(chat, false, { socket, chats: getState().chat.chats, dispatch: dispatch, activeChat: getState().chat.activeChat, user: getState().chat.user })
    })

    socket.on(RECIEVE_NOTIFICATION, (notification)=>{

                dispatch({
                            type: ADD_NOTIFICATION,
                            payload: notification
                 })

    })


    return function (next) {
        return function (action) {

            if (action.type === PASS_VERIFY_USER_TO_MIDDLEWARE) {
                socket.emit(VERIFY_USER, action.payload.email, action.payload.role, ({ user, isUser, notifications }) => {

                    if (!isUser) {
                        dispatch({
                            type: SET_CHAT_USER,
                            payload: user
                        })
                        if (notifications.length > 0)
                        dispatch({
                            type: NOTIFICATIONS_FOUND,
                            payload: notifications
                        })
                        else
                        dispatch({
                            type: NOTIFICATIONS_NOT_FOUND,
                            payload: notifications
                        })
                        socket.emit(USER_CONNECTED, user);
                        socket.emit(COMMUNITY_CHAT, (chat) => {
                            resetChat(chat, { socket, chats: getState().chat.chats, dispatch: dispatch, activeChat: getState().chat.activeChat, user: user })
                        })

                    }
                });
            }

            if (action.type === PASS_PRIVATE_MESSAGE_USER_TO_MIDDLEWARE) {

                const user = getState().chat.user
                const activeChat = getState().chat.activeChat
                socket.emit(PRIVATE_MESSAGE, { reciever: action.payload.reciever, sender: user, activeChat })
                let found = getState().chat.users.some(usr => usr.email === action.payload.reciever.email)

                if (!found) {
                    dispatch({
                        type: UPDATE_OFFLINE_STATUS,
                        payload: action.payload.reciever.email
                    })
                }
            }

            if (action.type === PASS_MESSAGE_SENT_TO_MIDDLEWARE) {
                sendMessage(action.payload.chatId, action.payload.message, socket, getState().chat.activeChat,
                    getState().chat.offlineUsers, getState().chat.user, getState().chat.users, dispatch)

            }

            if (action.type === PASS_TYPING_TO_MIDDLEWARE) {
                sendTyping(action.payload.chatId, action.payload.isTyping, socket)
            }

            if (action.type === CHAT_LOGOUT) {
                socket.emit(LOGOUT);
            }

            if (action.type === PASS_SEND_NOTIFICATION_TO_MIDDLEWARE) {
                socket.emit(SEND_NOTIFICATION, {notification: action.payload});
            }

            return next(action)
        }
    }




}


/*
*	Reset the chat back to only the chat passed in.
* 	@param chat {Chat}
*/
const resetChat = (chat, { socket, chats, dispatch, user }) => {
    return addChat(chat, true, { socket, chats, dispatch, user })
}

/*
*	Adds chat to the chat container, if reset is true removes all chats
*	and sets that chat to the main chat.
*	Sets the message and typing socket events for the chat.
*	
*	@param chat {Chat} the chat to be added.
*	@param reset {boolean} if true will set the chat as the only chat.
*/
const addChat = (chat, reset = false, { socket, chats, dispatch, user }) => {

    // const { socket } = this.props
    // const { chats } = this.state
    let chatAvailable = false
    chats.map(ch => {
        if (ch.id === chat.id) {
            chatAvailable = true;
        }
    })
    if (!chatAvailable) {
        const newChats = reset ? [chat] : [...chats, chat]
        var payload = null
        if (reset) {
            payload = {
                chats: newChats,
                activeChat: chat
            }
        }
        else {
            payload = {
                chats: newChats
            }
        }

        dispatch({
            type: ADD_CHAT,
            payload: payload
        })

        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
        const typingEvent = `${TYPING}-${chat.id}`
        const updateTyping = updateTypingInChat(user, newChats, dispatch)
        const recieveMessage = addMessageToChat(chat.id, newChats, dispatch)
        socket.on(typingEvent, ({ name, isTyping, email, chatId }) => {

            updateTyping(name, isTyping, email, chatId)
        })
        socket.on(messageEvent, (message) => { recieveMessage(message) })
    }
}

/*
* 	Returns a function that will 
*	adds message to chat with the chatId passed in. 
*
* 	@param chatId {number}
*/
const addMessageToChat = (chatId, chats, dispatch) => {


    return message => {
        let newChats = chats.map((chat) => {

            if (chat.id === chatId)

                chat.messages.push(message)
            return chat
        })

        dispatch({
            type: UPDATE_CHAT,
            payload: newChats
        })
    }
}

/*
*	Updates the typing of chat with id passed in.
*	@param chatId {number}
*/
const updateTypingInChat = (user, chats, dispatch) => {
    return (name, isTyping, email, chatId) => {
        let typingChat = null
        if (email !== user.email) {
            chats.map((chat) => {
                if (chat.id === chatId) {
                    if (isTyping && !chat.typingUsers.includes(name)) {
                        chat.typingUsers.push(name)
                    } else if (!isTyping && chat.typingUsers.includes(name)) {
                        chat.typingUsers = chat.typingUsers.filter(u => u !== name)
                    }
                    typingChat = chat
                }
                return chat
            })
            dispatch({
                type: UPDATE_CHAT,
                payload: { typingChat: typingChat, ChatId: chatId },

            })
        }
    }
}

/*
*	Adds a message to the specified chat
*	@param chatId {number}  The id of the chat to be added to.
*	@param message {string} The message to be added to the chat.
*/
const sendMessage = (chatId, message, socket, activeChat, offlineUsers, user, users, dispatch) => {

    if (activeChat) {
        let OpenChatForReciever = false
        let reciever = {};

        activeChat.users.map(usr => {
            if (usr.email !== user.email) {
                reciever.email = usr.email
                reciever.name = usr.name
                if ("role" in usr && usr.role === "admin")
                    reciever.role = usr.role
            }
        })

        if (chatId !== "Community") {
            // reciever.name = activeChat.users[i].name
            users.map(user => {
                if (user.email === reciever.email) {
                    reciever.name = user.name
                    return
                }
            })
            let userIndex = -1
            let j = -1;
            offlineUsers.map(user => {
                j++;
                if (user === reciever.email) {
                    userIndex = j
                }
            })
            if (userIndex !== -1) {
                let found = users.some(usr => usr.email === reciever.email)
                //send PRIVATE_MESSAGE to user to resume its chat auto
                if (found) {
                    OpenChatForReciever = true;
                    let tempOfflineUsers = offlineUsers
                    tempOfflineUsers.splice(userIndex, 1);
                    dispatch({
                        type: SET_OFFLINE_STATUS,
                        payload: {
                            offlineUsers: tempOfflineUsers
                        }
                    })
                }
            }
        }


        socket.emit(MESSAGE_SENT, { chatId, message, reciever, OpenChatForReciever })
    }
}

/*
*	Sends typing status to server.
*	chatId {number} the id of the chat being typed in.
*	typing {boolean} If the user is typing still or not.
*/
const sendTyping = (chatId, isTyping, socket) => {
    socket.emit(TYPING, { chatId, isTyping })
}
