
const { v4: uuidv4 } = require('uuid');

/*
*	createUser
*	Creates a user.
*	@prop id {string}
*	@prop name {string}
*	@param {object} 
*		name {string}
*/
const createUser = ({name = "", socketId = null, adminChats=[], email="", role = null, userId=null } = {})=>(
	{
		
		id:uuidv4(),
		name,
		socketId,
		adminChats,
		email,
		role,
		userId
		
	}
)

/*
*	createMessage
*	Creates a messages object.
* 	@prop id {string}
* 	@prop time {Date} the time in 24hr format i.e. 14:22
* 	@prop message {string} actual string message
* 	@prop sender {string} sender of the message
*	@param {object} 
*		message {string}
*		sender {string}
*/
const createMessage = ({message = "", sender = "", senderName=""} = { })=>(
		{
			_id:uuidv4(),
			time:Date.now(),
			message,
			sender,
			senderName, 	
		}

	)

/*
*	createChat
*	Creates a Chat object
* 	@prop id {string}
* 	@prop name {string}
* 	@prop messages {Array.Message}
* 	@prop users {Array.string}
*	@param {object} 
*		messages {Array.Message}
*		name {string}
*		users {Array.string}
* 
*/
const createChat = ({id="Community", messages = [], name = "Community", users = [], usersEmail=[], avatar=null} = {})=>(
	{
		// id:uuidv4(),
		id,
		name,
		messages,
		users,
		typingUsers:[],
		usersEmail,
		avatar
	}
)


/*
*	@param date {Date}
*	@return a string represented in 24hr time i.e. '11:30', '19:30'
*/
const getTime = (date)=>{
	return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports = {
	createMessage,
	createChat,
	createUser
}