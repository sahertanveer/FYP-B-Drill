/*
* createChatNameFromUsers
* @param users {Array.string} 
* @param excludedUser {string} user to exclude from list of names
* @return {string} users names concatenated by a '&' or "Empty Chat" if no users
*/
const createChatNameFromUsers = (users, excludedUser = "") => {

	let filteredUsers = users.filter(u => u.email !== excludedUser ? u.name : "")

	return filteredUsers.length ? filteredUsers.map( usr => {return usr.name}  ).join(' & ') : "Community Chat"

}

module.exports = {
	createChatNameFromUsers
}