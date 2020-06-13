const Admin = require('../../../models/Admin')
const Organization = require('../../../models/Organization')
const User = require('../../../models/User')
const Manager = require('../../../models/Manager')
const Message = require('../../../models/Message')
const Notification = require('../../../models/Notification')
const values = require('lodash')
const { webServerUrl } = require('../../../config/url')
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const io = require('../../../server.js').io

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED,
	LOGOUT, COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT,
	TYPING, PRIVATE_MESSAGE, SEND_NOTIFICATION, RECIEVE_NOTIFICATION, GET_AVAILABLE_CONTACTS } = require('./Events')

const { createUser, createMessage, createChat } = require('./Factories')

let connectedUsers = {}
let connectedAdmins = {}
// let connectedChats = {}

let communityChat = createChat()

module.exports = function (socket) {

	// console.log('\x1bc'); //clears console
	console.log("Socket Id:" + socket.id);

	let sendMessageToChatFromUser;

	let sendTypingFromUser;

	//Verify Username
	socket.on(VERIFY_USER, async (email, role, callback) => {

		let user = null;
		if (role === "admin") {
			user = await Admin.findOne({ email });
		}
		else if (role === "organization") {
			user = await Organization.findOne({ email });
			user.firstname = user.organizationname
		}
		else if (role === "manager") {
			user = await Manager.findOne({ email });
		}
		else if (role === "candidate") {
			user = await User.findOne({ email });
		}
		if (user) {
			let notifications = []
			try {
				notifications = await Notification.find({ reciever_email: user.email, read: false });
			}
			catch (err) { console.log(err); }

			callback({ isUser: false, user: createUser({ name: user.firstname, socketId: socket.id, email: user.email, userId: user._id, role: role }), notifications: notifications })
		} else
			callback({ isUser: true, user: null, notifications: null })

	})

	//User Connects with username
	socket.on(USER_CONNECTED, (user) => {
		user.socketId = socket.id

		if (user.role === "admin")
			connectedAdmins = addAdmin(connectedAdmins, user)

		connectedUsers = addUser(connectedUsers, user)


		socket.user = user
		sendMessageToChatFromUser = sendMessageToChat(user.email, user.name)
		sendTypingFromUser = sendTypingToChat(user)
		io.emit(USER_CONNECTED, connectedUsers, connectedAdmins, user.role)

	})



	//User disconnects
	socket.on('disconnect', () => {
		if ("user" in socket) {
			if (socket.user.role === "admin")
				connectedAdmins = removeAdmin(connectedAdmins, socket.user.email)

			connectedUsers = removeUser(connectedUsers, socket.user.email)
			io.emit(USER_DISCONNECTED, connectedUsers)
			// }
		}
	})


	//User logsout
	socket.on(LOGOUT, () => {
		if (socket.user.role === "admin")
			connectedAdmins = removeAdmin(connectedAdmins, socket.user.email)

		connectedUsers = removeUser(connectedUsers, socket.user.email)
		io.emit(USER_DISCONNECTED, connectedUsers)


	})

	//Get Community Chat
	socket.on(COMMUNITY_CHAT, (callback) => {
		callback(communityChat)
	})

	//reciever == object of receiver user
	socket.on(MESSAGE_SENT, async ({ chatId, message, reciever, OpenChatForReciever }) => {

		try {
			if (OpenChatForReciever) {
				const recieverSocket = connectedUsers[reciever.email].socketId

				var userNameArray = [reciever.email, socket.user.email].sort();
				var roomId = userNameArray[0] + userNameArray[1]
				try {
					var room = await Message.find({ room: roomId }).sort({ 'time': 1 });
				}
				catch (error) {
					console.log(error)
					room = null;
				}
				let newChat = createChat({ id: roomId, name: `${reciever.name} & ${socket.user.name}`, users: [reciever, socket.user], usersEmail: [reciever.email, socket.user.email], messages: room })
				socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
			}
		}
		catch (err) {
			console.log(err)
		}

		sendMessageToChatFromUser(chatId, message)

		//Message Notification
		if(chatId !=="Community"){
		try {
			const entryExist = await Notification.findOne({ reciever_email: reciever.email, read: false, sender: socket.user.email, notification_type: "chat" });

			let notification_id = uuidv4();
			const notificationFields = {};
			notificationFields.sender = socket.user.email;
			notificationFields.url = "chatlayout";
			notificationFields.notification_id = notification_id
			notificationFields.reciever_role = reciever.role;
			notificationFields.message = `You have new message from ${socket.user.email}`;
			notificationFields.reciever_email = reciever.email;
			notificationFields.notification_type = "chat";

			if (!entryExist) {
				notification = new Notification(notificationFields);
				notification.save();
			}
			if (reciever.email in connectedUsers) {
				socket.to(connectedUsers[reciever.email].socketId).emit(RECIEVE_NOTIFICATION, notificationFields)

			} else if (reciever.email in connectedAdmins) {
				socket.to(connectedAdmins[reciever.email].socketId).emit(RECIEVE_NOTIFICATION, notificationFields)
			}
		}
		catch (err) {
			console.log(err)
		}
	}
	})

	socket.on(TYPING, ({ chatId, isTyping }) => {
		sendTypingFromUser(chatId, isTyping)
	})

	socket.on(PRIVATE_MESSAGE, async ({ reciever, sender, activeChat }) => {

		if (reciever.role === "admin") {
			let fields = Object.keys(connectedAdmins)
			if (!fields.length > 0)
				return


			let key = fields[Math.floor(Math.random() * fields.length)]
			reciever.email = connectedAdmins[key].email;
			reciever.name = connectedAdmins[key].name;

		}
		var userNameArray = [reciever.email, sender.email].sort();
		var roomId = userNameArray[0] + userNameArray[1]
		try {
			var room = await Message.find({ room: roomId }).sort({ 'time': 1 });
		}
		catch (error) {
			console.log(error)
			room = null;
		}
		let newChat = createChat({ id: roomId, name: `${reciever.name} & ${sender.name}`, users: [reciever, sender], usersEmail: [reciever.email, socket.user.email], messages: room })

		if (reciever.email in connectedUsers) {

			const recieverSocket = connectedUsers[reciever.email].socketId
			socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
			socket.emit(PRIVATE_MESSAGE, newChat)
			socket.emit(PRIVATE_MESSAGE, newChat)
		}
		else

			socket.emit(PRIVATE_MESSAGE, newChat)
	});


	socket.on(SEND_NOTIFICATION, ({ notification }) => {
		// 	const config = { 
		// 		headers: {
		// 			'Content-Type': ' application/json ' //application/x-www.form-urlencoded
		// 		}
		// 	}
		// 	const body = JSON.stringify(notification);
		//   await axios.post(
		//     `${webServerUrl}api/notification/addnewnotification`,
		//     body,
		//     config
		//   );


		const { sender, reciever_role, message, reciever_email, notification_type, url } = notification;
		if (reciever_email && reciever_role && message) {

			let notification_id = uuidv4();
			let recieverList = connectedUsers;
			if (reciever_role !== "admin")
				recieverList = connectedUsers;
			else recieverList = connectedAdmins;

			try {

				notification.notification_id = notification_id
				if (reciever_email in recieverList) {
					const recieverSocket = recieverList[reciever_email].socketId
					socket.to(recieverSocket).emit(RECIEVE_NOTIFICATION, notification)
				}
			}
			catch (err) {
				console.log(err);
			}

			const notificationFields = {};
			if (sender) notificationFields.sender = sender;
			if (url) notificationFields.url = url;
			notificationFields.notification_id = notification_id
			notificationFields.reciever_role = reciever_role;
			notificationFields.message = message;
			notificationFields.reciever_email = reciever_email;
			notificationFields.notification_type = notification_type;

			try {
				notification = new Notification(notificationFields);
				notification.save();

			} catch (err) {
				console.error(err);
			}
		}

	})


}
/*
* Returns a function that will take a chat id and a boolean isTyping
* and then emit a broadcast to the chat id that the sender is typing
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendTypingToChat(user) {
	return (chatId, isTyping) => {
		io.emit(`${TYPING}-${chatId}`, { name: user.name, isTyping, email: user.email, chatId: chatId })
	}
}

/*
* Returns a function that will take a chat id and message
* and then emit a broadcast to the chat id.
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendMessageToChat(email, name) {

	return async (chatId, message) => {
		try {
			let newMessg = new Message({ room: chatId, message: message, sender: email, senderName: name })
			await newMessg.save();
		}
		catch (error) {
			console.log(error);
		}

		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({ message, sender: email, senderName: name }))
	}
}

/*
* Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
*/
function addUser(userList, user) {
	let newList = Object.assign({}, userList)
	newList[user.email] = user
	return newList
}

function addAdmin(adminList, user) {

	let newList = Object.assign({}, adminList)
	newList[user.email] = user
	return newList
}

/*
* Removes user from the list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {string} name of user to be removed
* @return userList {Object} Object with key value pairs of Users
*/
function removeUser(userList, username) {
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}

function removeAdmin(adminList, username) {
	let newList = Object.assign({}, adminList)
	delete newList[username]
	return newList
}

/*
* Checks if the user is in list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {String}
* @return userList {Object} Object with key value pairs of Users
*/
function isUser(userList, username) {
	return username in userList
}