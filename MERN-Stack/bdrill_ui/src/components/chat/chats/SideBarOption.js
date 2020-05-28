import React, { PureComponent } from 'react'
import {GoPrimitiveDot} from 'react-icons/go'
import PropTypes from 'prop-types'

export default class SideBarOption extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        lastMessage: PropTypes.string,
        active: PropTypes.bool,
        onClick: PropTypes.func
    }
    static defaultProps = {
        lastMessage: "",
        active:false,
        onClock: () => { }
    }
    render() {
        const { active, lastMessage, name, onClick, email, onlineStatus, activeBar } = this.props
        return (
            <div 
                className={`user ${active ? 'active':''}`}
                onClick={onClick}
                >
                <div className="user-photo">{name ? name[0].toUpperCase() : null}{activeBar && activeBar === "contacts" && onlineStatus? <GoPrimitiveDot/> : null}</div>
                <div className="user-info">
                    <div className="name">{name}</div>
                    {email ? <span className="title"><small>{email}</small></span> :
                    <div className="last-message">{lastMessage}</div>
                }
                </div>
                
            </div>
        )
    }
}
