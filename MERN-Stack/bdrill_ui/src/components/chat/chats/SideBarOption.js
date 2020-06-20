import React, { PureComponent } from 'react'
import { GoPrimitiveDot } from 'react-icons/go'
import PropTypes from 'prop-types'
import { defaultAvatar } from '../../../config/default';
import { BackendInstance } from '../../../config/axiosInstance';

export default class SideBarOption extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        lastMessage: PropTypes.string,
        active: PropTypes.bool,
        onClick: PropTypes.func
    }
    static defaultProps = {
        lastMessage: "",
        active: false,
        onClock: () => { }
    }
    render() {
        const { active, lastMessage, name, onClick, email, onlineStatus, activeBar, avatar } = this.props
        return (
            <div
                className={`user ${active ? 'active' : ''}`}
                onClick={onClick}
            >
                <div className="user-photo ">{avatar ?
                    <img src={`${BackendInstance.defaults.baseURL}${avatar}`} className='round-img center' style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'block' }}
                    /> :
                    <div className='round-img center' style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'block', background:'#ffff', color:'#000000', paddingTop:'25%' }}>
                        {name ? name[0].toUpperCase() : null}</div>
                }</div>
                <div className="user-info">
                    <div className="name">{name} {activeBar && activeBar === "contacts" && onlineStatus ? <GoPrimitiveDot color="green" /> : null}</div>
                    {email ? <span className="title"><small>{email}</small></span> :
                        <div className="last-message">{lastMessage}</div>
                    }
                </div>

            </div>
        )
    }
}
