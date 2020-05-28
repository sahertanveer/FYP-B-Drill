import React, { Component } from 'react';
import moment from "moment";

export default class Messages extends Component {
	constructor(props) {
	  super(props);
		
		this.scrollDown = this.scrollDown.bind(this)
	}

	scrollDown(){
		const { container } = this.refs
		container.scrollTop = container.scrollHeight
	}

	componentDidMount() {
		this.scrollDown()
	}

	componentDidUpdate(prevProps, prevState) {
		this.scrollDown()
	}
	
	render() {
		const { messages, user, typingUsers } = this.props
		
		return (
			<div ref='container'
				className="thread-container">
				<div className="thread">
					{
						messages.map((mes)=>{
							return (
								<div
									key={mes._id}
									className={`message-container ${mes.sender === user.email && 'right'}`}
								>
									{/* <div>{mes.sender} {user.email}</div> */}
									<div className="time">{moment(new Date(mes.time)).format('D MM YYYY , HH:mm')}</div>
									<div className="data">
										<div className="message">{mes.message}</div>
										<div className="name">{mes.senderName}</div>
									</div>
								</div>

								)
						})
					}
					{
						typingUsers.map((name)=>{
							return (
								<div key={name} className="typing-user">
									{`${name} is typing . . .`}
								</div>
							)
						})
					}
				</div>


			</div>
		);
	}
}
