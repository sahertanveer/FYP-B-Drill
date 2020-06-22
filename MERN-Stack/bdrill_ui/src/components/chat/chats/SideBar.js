import React, { Component } from 'react';
import SideBarOption from './SideBarOption'
import { last, get } from 'lodash'
import { createChatNameFromUsers } from '../Factories'
export default class SideBar extends Component {
	static type = {
		CHATS: "chats",
		CONTACTS: "contacts"
	}
	constructor(props) {
		super(props)
		this.state = {
			reciever: "",
			activeSideBar: SideBar.type.CHATS
		}
	}
	handleSubmit = (e) => {
		e.preventDefault()
		const { reciever } = this.state
		const { onSendPrivateMessage } = this.props

		onSendPrivateMessage(reciever)
		this.setState({ reciever: "" })
	}

	addChatForUser = (reciever) => {

		this.props.onSendPrivateMessage(reciever)
		this.setActiveSideBar(SideBar.type.CHATS)
	}
	setActiveSideBar = (type) => {
		this.setState({ activeSideBar: type })
	}

	displayAdmin = () => {
		return (

			<SideBarOption
				onlineStatus={false}
				activeBar={this.state.activeSideBar}
				key="admin-key"
				name="Support"
				email=""
				onClick={() => { this.addChatForUser({ role: "admin" }) }}
			/>

		)

	}

	displayOrganzations = (org) => {
		return (

			org.map(organization => {

				return (
					<SideBarOption
						avatar={organization.avatar}
						activeBar={this.state.activeSideBar}
						onlineStatus={organization.email in this.props.usersObj ? true : false}
						key={organization._id}
						name={organization.organizationname}
						email={organization.email}
						onClick={() => { this.addChatForUser({ name: organization.organizationname, email: organization.email, role: "organization", avatar:organization.avatar }) }}
					/>

				)

			})

		)

	}

	displayManagers = (man) => {
		return (


			man.map(manager => {
				return (

					<SideBarOption
						avatar={manager.avatar}
						onlineStatus={manager.email in this.props.usersObj ? true : false}
						activeBar={this.state.activeSideBar}
						key={manager._id}
						name={manager.firstname}
						email={manager.email}
						onClick={() => { this.addChatForUser({ name: manager.firstname, email: manager.email, role: "manager", avatar:manager.avatar }) }}
					/>
				)
			})




		)

	}

	displayCandidates = (cand) => {
		return (

			cand.map(candidate => {

				return (
					<SideBarOption
						avatar={candidate.avatar}
						activeBar={this.state.activeSideBar}
						onlineStatus={candidate.email in this.props.usersObj ? true : false}
						key={candidate._id}
						name={candidate.firstname}
						email={candidate.email}
						onClick={() => { this.addChatForUser({ name: candidate.firstname, email: candidate.email, role: "candidate", avatar:candidate.avatar }) }}
					/>
					// <li class="collection-item">
					// 	<li class="collection-item avatar">
					// 	<img src="" alt="" class="circle"></img>

					// 	<span class="title">{candidate.firstname}</span>
					// 	<p>{candidate.email}
					// 	</p> </li>
				)
			})

		)

	}

	renderAdminContacts = (contacts) => {
		var fields = Object.keys(contacts)
		return fields.map((field, index) =>{
			return(
		  <ul key={index} className="collection with-header">
			<li className="collection-header black-text"><h6>{field}</h6></li>
			{contacts[field] ? (field==="Organizations" ? this.displayOrganzations(contacts[field]) : field==="Candidates" ?this.displayCandidates(contacts[field]) : field==="Managers" ?this.displayManagers(contacts[field]) :null) : null}
			</ul>
			)
		})
	}

	renderManagerContacts = (contacts) => {
		var fields = Object.keys(contacts)
		return fields.map((field, index) => {
			return (
				<ul key={index} className="collection with-header">
					<li className="collection-header black-text"><h6>{field}</h6></li>
					{contacts[field] ? (field === "Admin" ? this.displayAdmin(contacts[field]) : field === "Organizations" ? this.displayOrganzations(contacts[field]) : this.displayCandidates(contacts[field])) : null}
				</ul>
			)
		})
	}

	renderOrganizationContacts = (contacts) => {
		var fields = Object.keys(contacts)
		return fields.map((field, index) => {
			return (
				<ul key={index} className="collection with-header">
					<li className="collection-header black-text"><h6>{field}</h6></li>
					{contacts[field] ? (field === "Admin" ? this.displayAdmin(contacts[field]) : field === "Managers" ? this.displayManagers(contacts[field]) : this.displayCandidates(contacts[field])) : null}
				</ul>
			)
		})
	}

	renderCandidateContacts = (contacts) => {
		var fields = Object.keys(contacts)
		return fields.map((field, index) => {
			return (
				<ul key={index} className="collection with-header">
					<li className="collection-header black-text"><h6>{field}</h6></li>
					{contacts[field] ? (field === "Admin" ? this.displayAdmin(contacts[field]) : field === "Organizations" ? this.displayOrganzations(contacts[field]) : this.displayManagers(contacts[field])) : null}
				</ul>
			)
		})
	}




	render() {
		const { chats, activeChat, user, setActiveChat, role, contacts, chatWidget } = this.props
		const { activeSideBar } = this.state
		return (
			<div id="side-bar" style={chatWidget ? {width:"75%"}: null}>
				<div className="heading">
					<p>B-Drill Chat</p>
				</div>
				<form onSubmit={this.handleSubmit} className="search">
					<p className="center">Live Chat + Private Chat</p>
				</form>
				<div className="side-bar-select">
					<div
						onClick={() => { this.setActiveSideBar(SideBar.type.CHATS) }}
						className={`side-bar-select__option ${activeSideBar === SideBar.type.CHATS ? 'active' : ''}`}>
						<span>Chats</span>
					</div>
					<div
						onClick={() => { this.setActiveSideBar(SideBar.type.CONTACTS) }}
						className={`side-bar-select__option ${activeSideBar === SideBar.type.CONTACTS ? 'active' : ''}`}>
						<span>Contacts</span>
					</div>
				</div>
				<div
					className="users"
					ref='users'
					onClick={(e) => { (e.target === this.refs.user) && setActiveChat(null) }}>

					{
						activeSideBar === SideBar.type.CHATS ?
							chats.map((chat) => {
								const reciverAvatar =chat && chat.users && chat.users.find(u => u.email !== user.email )
								return (
									
									<SideBarOption
										avatar={reciverAvatar && reciverAvatar.avatar ? reciverAvatar.avatar : null}
										activeBar={this.state.activeSideBar}
										key={chat.id}
										lastMessage={get(last(chat.messages), 'message', '')}
										name={chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.email)}
										active={activeChat.id === chat.id}
										onClick={() => { this.props.setActiveChat(chat) }}
									/>
								)
							})
							: (
								role === "admin" ?
									this.renderAdminContacts(contacts) :

									role === "candidate" ?
										this.renderCandidateContacts(contacts) :

										role === "manager" ?
											this.renderManagerContacts(contacts)

											:
											this.renderOrganizationContacts(contacts)
							)

					}
				</div>
				<div className="current-user">
					<span>{user.name}</span>
				</div>
			</div>
		);

	}
}
