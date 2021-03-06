import React, { Component } from 'react';
import SideBar from './SideBar'
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { passOpenPrivateMessage, passMessageSent, passTyping, setActiveChat, logout } from '../../../actions/chatAction'



class ChatContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			chats: [],
			users: [],
			offlineUsers: [],
			activeChat: null,
			displaySideBar: false,
			chatWidget: this.props && this.props.chatWidget? this.props.chatWidget : false 

		};
	}


	logout = () => {
		this.props.logout();
	}

	toggleSideBar =()=>{
		this.setState((prevState)=>{this.setState({displaySideBar: !prevState.displaySideBar})})
	}

	sendOpenPrivateMessage = (reciever) => {
		this.props.passOpenPrivateMessage(reciever);
	}

	/*
	*	Adds a message to the specified chat
	*	@param chatId {number}  The id of the chat to be added to.
	*	@param message {string} The message to be added to the chat.
	*/
	sendMessage = (chatId, message) => {
		this.props.passMessageSent(message, chatId)
	}

	/*
	*	Sends typing status to server.
	*	chatId {number} the id of the chat being typed in.
	*	typing {boolean} If the user is typing still or not.
	*/
	sendTyping = (chatId, isTyping) => {
		this.props.passTyping(chatId, isTyping)
	}

	setActiveChat = (activeChat) => {
		this.props.setActiveChat(activeChat)
	}
	render() {
		const { user, logout, role, contacts } = this.props
		const { chats, activeChat, usersObj } = this.props.chat
		return (
			<div className="container chatcontainer" style={this.props && this.props.style} >
				{ !this.state.chatWidget || this.state.displaySideBar 
				?
				<SideBar
					chatWidget={this.state.chatWidget}
					logout={logout}
					chats={chats}
					user={user}
					usersObj={usersObj}
					role={role}
					contacts={contacts}
					activeChat={activeChat}
					setActiveChat={this.setActiveChat}
					onSendPrivateMessage={this.sendOpenPrivateMessage}
				/> :
				null
			}
				<div className="chat-room-container" style={{width:"100%"}}>
					{
						activeChat !== null ? (

							<div className="chat-room"  >
								
								<ChatHeading name={activeChat.name} sideBarMenuDisplay={this.state.chatWidget} sideBarToggler={this.toggleSideBar} />
								<Messages
									messages={activeChat.messages}
									user={user}
									typingUsers={activeChat.typingUsers}
								/>
								<MessageInput
									sendMessage={
										(message) => {
											this.sendMessage(activeChat.id, message)
										}
									}
									sendTyping={
										(isTyping) => {
											this.sendTyping(activeChat.id, isTyping)
										}
									}
								/>

							</div>
						) :
							<div className="chat-room choose">
								<h3>Choose a chat!</h3>
							</div>
					}
				</div>

			</div>
		);
	}
}

ChatContainer.propTypes = {
	chat: PropTypes.object.isRequired,
	passOpenPrivateMessage: PropTypes.func.isRequired,
	passMessageSent: PropTypes.func.isRequired,
	setActiveChat: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
	chat: state.chat
})
export default (connect(mapStateToProps, { passOpenPrivateMessage, passMessageSent, passTyping, setActiveChat, logout })(ChatContainer))
