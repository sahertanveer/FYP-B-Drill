import React from 'react';
import { withRouter, BrowserRouter, Route, useHistory } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import UserProfile from './UserProfile'
import { setPage } from '../../actions/pageAction'
import { getProfileById } from '../../actions/profileAction'
import { defaultAvatar } from '../../config/default';
import { BackendInstance } from '../../config/axiosInstance';

const ProfileItem = ({ profile, setPage, getProfileById, authRole }) => {
    
    const history = useHistory()
    const colors = [
        '#FFA07A',
        '#CD5C5C',
        "#CEE92F",
        "#bada55",
        "#008080",
        "#b38966",
        "#4d6198",
        '#2a2847',
        '#563566',
        '#d65491',
        '#917f26',
        '#8a3f62',
        "#A53C3C",
        "#60beb3",
        "#6CD566",
        "#FF7C83",
        "#FF702D",
        '#b468d9',
        "#FFAA42",
        "#50E5FF",
        "#FFDC75",
        '#F08080',
        '#FA8072',
        '#E9967A',
        '#800000',
        "#7F7B82",
        "#4D7EA8"
    ];
    const color = colors[Math.floor(Math.random() * 16)]
    let style = { borderColor: color, backgroundColor: color }

    const onClick = (e, role) => {
        getProfileById(e.currentTarget.value)
        setPage(`${authRole}childuserprofile`) ;
        history.push(`/${authRole}childuserprofile?userId=${e.currentTarget.value}&role=${role}`);
         
    }

    return (
        <BrowserRouter>
            {/* <div className="row"> */}
                {profile && profile.user ?
                    <div className="col s12 m12 l4" style={style}>&nbsp;
                        <div className="row" key={profile._id}>
                            <div className="col s12 m6 l4 center ">
                                <br />
                                <img src={profile.user.avatar ? `${BackendInstance.defaults.baseURL}${profile.user.avatar}`:defaultAvatar}
                                   alt=''
                                    className='round-img' style={{ borderRadius: '50%', width: '80px', height:'80px', display:'block' }}
                                />
                                {/* <img src={profile.user.avatar ? `${BackendInstance.defaults.baseURL}${profile.user.avatar}`:defaultAvatar} alt=''
                                    className='round-img' style={{ borderRadius: '50%', width: '80px' }}
                                /> */}
                            </div>
                            <div className="col s12 m6 l6">
                                <h6 className='white-text truncate-text' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS" }}>
                                    {profile.user.firstname}&nbsp;{profile.user.lastname}
                                </h6>
                                <a className='white-text truncate-text' href="mailto:{profile.user.email}">{profile.user.email}</a>
                                <p className='white-text truncate-text'>Role: Candidate</p>
                                <p className='white-text truncate-text'>{profile.status}</p>
                                {/* &nbsp; at  ,*/}
                                <p className='white-text truncate-text'>{profile.company}, {profile.location}</p>
                                <button onClick={(e) => onClick(e, 'candidate')} value={profile.user._id} className='btn success'>
                                     Profile
                                </button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="col s12 m12 l4" style={style}>&nbsp;
                        <div className="row" key={profile._id}>
                            <div className="col s12 m6 l4 center ">
                                <br />
                                <img src={profile.manager.avatar ? `${BackendInstance.defaults.baseURL}${profile.manager.avatar}`:defaultAvatar}
                                   alt=''
                                    className='round-img' style={{ borderRadius: '50%', width: '80px', height:'80px', display:'block' }}
                                />
                            </div>
                            <div className="col s12 m6 l6">
                                <h6 className='white-text truncate-text' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS" }}>
                                    {profile.manager && profile.manager.firstname}&nbsp;{profile.manager &&  profile.manager.lastname}
                                </h6>
                                <a className='white-text truncate-text' href="mailto:{profile.user.email}">{profile.manager && profile.manager.email}</a>
                                <p className='white-text truncate-text' >Role: Manager</p>
                                <p className='white-text truncate-text'>{profile.status}</p>
                                {/* &nbsp; at  {profile.company},*/}
                                <p className='white-text truncate-text'>{profile.company}, {profile.location}</p>
                                 <button onClick={(e) => onClick(e, 'manager')} value={profile.manager && profile.manager._id} className='btn success'>
                                     Profile
                                </button>
                            </div>
                        </div>
                    </div>}
            {/* </div> */}
            <Route path="/userprofile" component={UserProfile} />
        </BrowserRouter>
    );
};

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired,
    setPage:  PropTypes.object.isRequired,
    getProfileById: PropTypes.func.isRequired,
    authRole: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    page: state.page,
    authRole: state.auth.role
})


export default withRouter(connect(mapStateToProps, { setPage, getProfileById  })(ProfileItem));

