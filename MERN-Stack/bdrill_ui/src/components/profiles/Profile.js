import React, { Fragment, useEffect } from 'react'
import { withRouter, Route, BrowserRouter, useLocation  } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from "moment";
import { BackendInstance } from '../../config/axiosInstance';
import { getProfileById } from '../../actions/profileAction'
import queryString from 'query-string'
import { defaultAvatar } from '../../config/default';
import Loader from 'react-loader-spinner'

//  const location =useLocation()


const Profile = ({ getProfileById, auth: { user }, profile: { userprofile }}) => {
    const nullProfile = !userprofile;
    const values = queryString.parse(window.location.search)
   
    useEffect(() => {     
        
    console.log(values)
    getProfileById(values.role, values.userId);
    }, [getProfileById, nullProfile])
    if(userprofile === null){
        return(<div className="white-text center">
        <Loader color="#00BFFF" height={100} width={100} timeout={0} /> <br></br>
        Fetching User Profile
    </div>);
    }
    else
    return (
        
        <BrowserRouter>
            <div className="container-fluid">
                <div className="row">
                    <div className="col s12 m5 l3">
                        <div className="card animate fadeLeft uicards">
                            <div className="card-user">
                                <div className="author">
                                    <div className="block block-one" />
                                    <div className="block block-two" />
                                    <div className="block block-three" />
                                    <div className="block block-four" />
                                </div>
                            </div>
                            <div className="userimage center">
                                {console.log(userprofile)}
                            <img className="myprofileimg center" src={userprofile && userprofile.path ? `${BackendInstance.defaults.baseURL}${userprofile && userprofile.path}` : defaultAvatar}
                                   alt=''
                                   
                                />
                                {/* <img
                                    className="myprofileimg center"
                                    src={profile && profile.path ? `${BackendInstance.defaults.baseURL}${profile && profile.path}` : user && user.avatar}
                                    alt=""
                                /> */}
                            </div>

                            <div className=" card-content center">
                                <div className="icons my-1 white-text center">
                                    <a href="#!" className="btn linkbtn" target="_blank" title="github" rel="noopener noreferrer">
                                        <i className="fas fa-globe fa-1x white-text center"></i>
                                    </a>
                                        &nbsp;
                                    <a href="#!" className="btn linkbtn" target="_blank" title="twitter" rel="noopener noreferrer">
                                        <i className="fab fa-twitter fa-1x white-text "></i>
                                    </a>
                                        &nbsp;
                                    <a href="#!" className="btn linkbtn" target="_blank" title="facebook" rel="noopener noreferrer">
                                        <i className="fab fa-facebook fa-1x white-text "></i>
                                    </a>
                                        &nbsp;
                                    <a href="#!" className="btn linkbtn" target="_blank" title="linkedin" rel="noopener noreferrer">
                                        <i className="fab fa-linkedin fa-1x white-text "></i>
                                    </a>
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col s12 m7 l9">
                        <div className="card animate fadeLeft uicards">
                            <img src="https://shop.bankersweb.com/assets/images/%20Recent%20Changes%20in%20Cyber%20Privacy%20and%20Data%20Security_.jpg"
                                alt="abc"
                                height="200px"
                            />
                            <div className=" card-content">
                                <div className="row">
                                    <div className="col s12 m12 l12">
                                        <p className=' lead white-text left' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS" }}>
                                            {values.role==="candidate" ? (userprofile && userprofile.user && userprofile.user.firstname) : 
                                            (userprofile && userprofile.manager && userprofile.manager.firstname)}

                                            &nbsp;

                                            {values.role==="candidate" ? (userprofile && userprofile.user && userprofile.user.lastname) : 
                                            (userprofile && userprofile.manager && userprofile.manager.lastname)}
                                            {/* {userprofile && userprofile.user && userprofile.user.lastname} */}
                                        
                                        </p>
                                    </div>

                                </div>


                                <div className="row">
                                    <div className="col s12 m12 l12">
                                        <div className="white-text left" >
                                            <p style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                                {userprofile && userprofile.status} at {userprofile && userprofile.company}
                                            </p>
                                            <p style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                                {userprofile && userprofile.city}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="col s12 m12 l12">
                        <div className="card animate fadeLeft uicards">
                            <div className="card-action">
                                <h5 className="white-text"
                                    style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                    Bio
                                </h5>
                                <hr />
                                <br />
                                {userprofile && userprofile.bio === null ?
                                    (<p className=" white-text text-lighten-5">
                                        Bio not added.
                                    </p>
                                    ) : (
                                        <p className=" white-text text-lighten-5">
                                            {userprofile && userprofile.bio}
                                        </p>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="s12 m12 l12">
                        <div className="row">
                            <div className="col s12 m4 l4">
                                <div className="card animate fadeLeft uicards_card1">
                                    <div className="card-content">
                                        <h5 className="card-stats-number"
                                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                            Skills
                                                </h5>
                                        <hr />
                                        <br />
                                        {userprofile && userprofile.skills.map(function (item, i) {
                                            return <ul><li>{item}</li></ul>
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="col s12 m4 l4">
                                <div className="card animate fadeLeft uicards_card2">
                                    <div className="card-content">
                                        <h5 className="card-stats-number"
                                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                            Interests
                                                </h5>
                                        <hr />
                                        <br />
                                        {userprofile && userprofile.interests.map(function (item, i) {
                                            return <ul><li>{item}</li></ul>
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="col s12 m4 l4">
                                <div className="card animate fadeLeft uicards_card4">
                                    <div className="card-content">
                                        <h5 className="card-stats-number"
                                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                            Achievements
                                                </h5>
                                        <hr />
                                        <br />
                                        {userprofile && userprofile.achievements.map(function (item, i) {
                                            return <ul><li>{item}</li></ul>
                                        })}
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col s12 m6 l6">
                        <h5 className="white-text"
                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                            Education
                        </h5>
                        <div className="card animate fadeLeft uicards center ">
                            <p color=" lighten-1" width="100%" style={{ borderTop: "5px solid cyan" }} />
                            <br />
                            <i className="fas fa-graduation-cap fa-3x white-text center"></i>
                            {userprofile && userprofile.education ? (
                                <Fragment>
                                    <h6 htmlFor="Education" className="white-text center ">Studied at</h6>
                                    <br />
                                </Fragment>

                            ) : (
                                    <div className="white-text">No Education Added</div>
                                )}
                            {userprofile && userprofile.education.map(function (item, i) {
                                return (
                                    <div key={`${item}-${i}`}>
                                        <br /><b>
                                            {item.school}
                                        </b>
                                        <label className="white-text lighten-1 center" key={`${item}-${i}`}>
                                            <br /><b>{item && item.degree} {item && item.fieldofstudy}</b>
                                            <br />  From {moment(new Date(item && item.educationfrom)).format('YYYY-MM-DD')} To {item.educationcurrent ? (
                                                <p className="white-text">Current</p>
                                            ) : moment(new Date(item && item.educationto)).format('YYYY-MM-DD')}

                                        </label>
                                        <hr />
                                    </div>
                                );

                            })

                            }
                        </div>
                        <br />
                    </div>

                    <div className="col s12 m6 l6">
                        <h5 className="white-text"
                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                            Experience
                        </h5>
                        <div className="card animate fadeLeft uicards center">
                            <p color=" lighten-1" width="100%" style={{ borderTop: "5px solid cyan" }} />
                            <br />
                            <i className="fas fa-ribbon fa-3x white-text center"></i>
                            {userprofile && userprofile.experience ? (
                                <Fragment>
                                    <h6 htmlFor="Experience" className="white-text center ">Worked at</h6>
                                </Fragment>
                            ) : (
                                    <div className="white-text">No Experience Added</div>
                                )}
                            {userprofile &&
                                userprofile.experience.map(function (item, i) {
                                    return (
                                        <div key={`${item}-${i}`}>
                                            <br /><b>
                                                <h6>{item.jobcompany}</h6>
                                            </b>
                                                        as   {item.jobtitle}
                                            <label className="white-text lighten-1 center" key={`${item}-${i}`}>
                                                <br /><b>{item && item.joblocation}</b>
                                                <br />  From {moment(new Date(item && item.jobfrom)).format('YYYY-MM-DD')} To   {item.jobcurrent ? (
                                                    <p className="white-text">Current</p>
                                                ) : moment(new Date(item && item.jobto)).format('YYYY-MM-DD')}

                                            </label>
                                            <hr />
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <br />
                    </div>
                </div>

            </div>
        </BrowserRouter>
    )
}

Profile.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default withRouter(connect(mapStateToProps, { getProfileById })(Profile))

