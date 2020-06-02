import React, { Component } from 'react';
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from './Events'
import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class ChatLayout extends Component {

	constructor(props) {
		super(props);

		this.state = {
			socket: null,
			user: null
		};
	}


	render() {
		const { contacts } = this.props.auth
		const { user } = this.props.chat
		return (
			<div className="container chatcontainer">
				{
					user ?
						<ChatContainer user={user} contacts={contacts} role={this.props.auth.role} firstname={this.props.auth.firstname} email={this.props.auth.email} />
						: null
				}
			</div>
		);
	}
}
ChatLayout.propTypes = {
	auth: PropTypes.object.isRequired,
	chat: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	auth: state.auth,
	chat: state.chat
})
export default (connect(mapStateToProps)(ChatLayout))