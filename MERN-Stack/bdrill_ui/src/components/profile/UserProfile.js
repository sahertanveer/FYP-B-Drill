import React, { Fragment, useEffect } from 'react'
import { withRouter, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Popup from "reactjs-popup"
import moment from "moment";
import { BackendInstance } from '../../config/axiosInstance';
import { defaultAvatar } from '../../config/default';

import Card from '../common/cards/Card';
import CardHeader from '../common/cards/CardHeader';
import CardIcon from "../common/cards/CardIcon.js";
import CardBody from "../common/cards/CardBody.js";

import { getCurrentProfile, getProfilePhoto } from '../../actions/profileAction'
import ImageUpload from './ImageUpload'
import EditCreateProfile from './EditCreateProfile'

const UserProfile = ({ getCurrentProfile, getProfilePhoto, auth: { user, role }, profile: { profile, loading } }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile])
    return (
        <BrowserRouter>
            <div className="container-fluid">
                <div className="row">
                    <div className="col s12 m12 l12">
                        <div className="card animate fadeLeft uicards">
                            <div className="card-content">

                                <div className="row">
                                    <div className="col s12 m12 l7">
                                        <div className="userimage center">
                                            <img
                                                className="myprofileimg center"
                                                src={profile && profile.path ? `${BackendInstance.defaults.baseURL}${profile && profile.path}` : defaultAvatar}
                                                alt=""
                                            />
                                            <div className="">
                                                <Popup
                                                    trigger=
                                                    {
                                                        <div className="overlay">
                                                            <a href="#!" className="btn icon">
                                                                <i className="fas fa-edit small"></i>
                                                            </a>
                                                        </div>
                                                    }
                                                    modal
                                                    closeOnDocumentClick
                                                >
                                                    <div className="uicards" style={{ backgroundColor: "black", zIndex: 9999 }} >
                                                        <ImageUpload />
                                                    </div>
                                                </Popup>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col s12 m12 l5">
                                        <br /><br />
                                        <div className="row">
                                            <div className="col s12 m12 l12">
                                                <h2 className=' white-text' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS", marginTop: "-1px" }}>
                                                    {user && user.firstname}
                                                </h2>
                                                <h2 className=' white-text' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS", marginTop: "-1px" }}>
                                                    {user && user.lastname}
                                                </h2>
                                            </div>
                                            <div className="col s12 m12 l12">
                                                <div className="white-text" >
                                                    <p style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                                        {profile && profile.status} at {profile && profile.company}&nbsp;{profile && profile.city}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col s12 m12 l12">
                                                <br />
                                                <div className="white-text" >
                                                    <p><i>Email:</i> {user && user.email}</p>
                                                    <p><i>Website:</i> {profile && profile.website}</p>
                                                </div>
                                            </div>
                                            <div className="col s12 m12 l12">
                                                <br />
                                                <div className="icons my-1 white-text">
                                                    <a href={profile && profile.social && profile.social.githubusername} className="btn linkbtn" target="_blank" title="github" rel="noopener noreferrer">
                                                        <i className="fab fa-github fa-1x white-text "></i>
                                                    </a>
                                        &nbsp;
                                    <a href={profile && profile.social && profile.social.twitter} className="btn linkbtn" target="_blank" title="twitter" rel="noopener noreferrer">
                                                        <i className="fab fa-twitter fa-1x white-text "></i>
                                                    </a>
                                        &nbsp;
                                    <a href={profile && profile.social && profile.social.facebook} className="btn linkbtn" target="_blank" title="facebook" rel="noopener noreferrer">
                                                        <i className="fab fa-facebook fa-1x white-text "></i>
                                                    </a>
                                        &nbsp;
                                    <a href={profile && profile.social && profile.social.facebook} className="btn linkbtn" target="_blank" title="linkedin" rel="noopener noreferrer">
                                                        <i className="fab fa-linkedin fa-1x white-text "></i>
                                                    </a>
                                                    &nbsp;
                                    <a href={profile && profile.social && profile.social.youtube} className="btn linkbtn" target="_blank" title="youtube" rel="noopener noreferrer">
                                                        <i className="fab fa-youtube fa-1x white-text "></i>
                                                    </a>
                                                    &nbsp;
                                    <a href={profile && profile.social && profile.social.instagram} className="btn linkbtn" target="_blank" title="instagram" rel="noopener noreferrer">
                                                        <i className="fab fa-instagram fa-1x white-text "></i>
                                                    </a>
                                                    <br />
                                                </div>
                                            </div>
                                            <div className="col s12 m12 l12">
                                                <br /><br /><br />
                                                
                                                {loading || profile === null ? (
                                                    <div className="white-text">
                                                        {role && role === "manager" ?
                                                            <a href="/editcreateprofile" className="btn btn-danger right">
                                                                <i className="fas fa-edit circle white-text" title="Create Profile" /> Create Profile
                                                </a>
                                                            : <a href="/editorcreateprofile" className="btn btn-danger right">
                                                                <i className="fas fa-edit circle white-text" title="Create Profile" /> Create Profile
                                                </a>
                                                        }
                                                        <br />
                                                    </div>

                                                ) : (
                                                        <div className="white-text right " style={{ marginLeft: "2%" }}>
                                                            {role && role === "manager" ?
                                                                <a href="/editcreateprofile" className="small btn btn-primary">
                                                                    <i className="fas fa-edit white-text" title="Edit Profile" />
                                                                </a>
                                                                : <a href="/editorcreateprofile" className="btn btn-primary">
                                                                    <i className="fas fa-edit white-text" title="Edit Profile" />
                                                                </a>
                                                            }
                                                    &nbsp;
                                                            <Popup
                                                                className="popup"
                                                                style={{ height: "50vh", marginTop: '45%' }}
                                                                trigger=
                                                                {
                                                                    <button className="btn btn-success right">
                                                                        <i className="fas fa-info-circle white-text" title="About" />
                                                                    </button>
                                                                }
                                                                modal
                                                                closeOnDocumentClick
                                                            >
                                                                <div className="container-fluid">
                                                                    <div className="card animate fadeLeft" style={{ borderRadius: "12px" }}>
                                                                        <div className="card-content white-text mycard" style={{ backgroundColor: "#1fa398" }}>
                                                                            <h6 className="white-text"
                                                                                style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                                                                About
                                                            </h6>
                                                                        </div>
                                                                        <div style={{ marginLeft: "5px", fontSize: "14px" }} className="black-text lighten-1">
                                                                            <br />
                                                                            <p><b>Email:</b> {user && user.email}</p>
                                                                            <p><b>Phone:</b> {profile && profile.contact}</p>
                                                                            <p><b>Date of Birth: </b>{moment(new Date(profile && profile.dob)).format('YYYY-MM-DD')}</p>
                                                                            <p><b>Website:</b> {profile && profile.website}</p>
                                                                            <p><b>company:</b>{profile && profile.company}, {profile && profile.location}</p>
                                                                            <p><b>HomeTown:</b> {profile && profile.hometown}</p>
                                                                            <p><b>City:</b> {profile && profile.city}</p>
                                                                        </div>
                                                                        <div className="right">
                                                                            {role && role === "manager" ?
                                                                                <a href="/editcreateprofile" className="small btn success">
                                                                                    <i className="fas fa-edit white-text" title="Edit Profile" /> Edit
                                                        </a>
                                                                                : <a href="/editorcreateprofile" className="btn success">
                                                                                    <i className="fas fa-edit white-text" title="Edit Profile" /> Edit
                                                        </a>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Popup>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <section className="col xs12 s12 m7 l9">
                        <div className="row">
                            <div className="col xs12 s12 m12 l12">
                                <Card>
                                    <CardHeader color="primary" stats icon>
                                        <CardIcon color="primary">
                                            <i className="fa fa-user-secret fa-3x white-text center"></i>
                                        </CardIcon>
                                        <br />
                                        <h5>Bio</h5>
                                    </CardHeader>
                                    <CardBody >
                                        {profile && profile.bio ?
                                            (
                                                <p className=" white-text text-lighten-5">
                                                    {profile && profile.bio}
                                                </p>
                                            ) : (
                                                <p className=" white-text text-lighten-5">
                                                    Bio not added.
                                                </p>

                                            )
                                        }
                                    </CardBody>
                                </Card>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col xs12 s12 m12 l12">
                                <Card>
                                    <CardHeader color="success" stats icon>
                                        <CardIcon color="success">
                                            <i className="fas fa-graduation-cap fa-3x white-text center"></i>
                                        </CardIcon>
                                        <br />
                                        <h5>Education</h5>
                                    </CardHeader>
                                    <CardBody >
                                        {profile && profile.education && profile.education.length > 0 ? (
                                            <Fragment>
                                                {profile &&
                                                    profile.education.map(function (item, i) {
                                                        return (
                                                            <div className="white-text gray center" key={`${item}-${i}`}>
                                                                <br />
                                                                <p htmlFor="Education" className="white-text center ">Studied at</p>
                                                                <h5>{item.school}</h5>
                                                                <p className="white-text center" key={`${item}-${i}`}>
                                                                    {item && item.degree} {item && item.fieldofstudy}
                                                                </p>
                                                                <p className="white-text center" key={`${item}-${i}`}>
                                                                    from {moment(new Date(item && item.educationfrom)).format('YYYY-MM-DD')}
                                                                     &nbsp; to {item.educationcurrent ? (<>Current</>
                                                                    ) : moment(new Date(item && item.educationto)).format('YYYY-MM-DD')}
                                                                </p>
                                                                <hr />
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </Fragment>
                                        ) : (
                                                <div className="white-text">No Education Added</div>
                                            )}

                                    </CardBody>
                                </Card>
                            </div>

                            <div className="col xs12 s12 m12 l12">
                                <Card>
                                    <CardHeader color="info" stats icon>
                                        <CardIcon color="info">
                                            <i className="fas fa-ribbon fa-3x white-text center"></i>
                                        </CardIcon>
                                        <br />
                                        <h5>Experience</h5>
                                    </CardHeader>
                                    <CardBody >
                                        {profile && profile.experience && profile.experience.length > 0 ? (
                                            <Fragment>
                                                {profile &&
                                                    profile.experience.map(function (item, i) {
                                                        return (
                                                            <div className="white-text lighten-1 center" key={`${item}-${i}`}>
                                                                <p htmlFor="Experience" className="white-text center ">Worked as</p>
                                                                <h5>{item.jobtitle} </h5>
                                                                <p className="white-text lighten-1 center" key={`${item}-${i}`}>
                                                                    <br />at {item.jobcompany}, {item && item.joblocation}
                                                                    <p className="white-text">
                                                                        from {moment(new Date(item && item.jobfrom)).format('YYYY-MM-DD')}
                                                                         &nbsp; to {item.jobcurrent ? <>Current</> :
                                                                            moment(new Date(item && item.jobto)).format('YYYY-MM-DD')}</p>
                                                                </p>
                                                                <hr />
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </Fragment>
                                        ) : (
                                                <div className="white-text">No Experience Added</div>
                                            )}

                                    </CardBody>
                                </Card>
                            </div>

                        </div>

                    </section>

                    <aside className="col xs12 s12 m5 l3">
                        {/* {loading || profile === null ? (
                            <div></div>

                        ) : ( */}
                        <div className="row">
                            <div className="col xs12 s12 m12 l12">
                                <div className="card animate fadeLeft uicards_card1 cardStyle">
                                    <div className="card-content">
                                        <h5 className="card-stats-number"
                                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                            Skills
                                                </h5>
                                        <hr />
                                        <br />
                                        {profile && profile.skills.map(function (item, i) {
                                            return <ul key={i}><li>{item}</li></ul>
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="col xs12 s12 m12 l12">
                                <div className="card animate fadeLeft uicards_card2 cardStyle">
                                    <div className="card-content">
                                        <h5 className="card-stats-number"
                                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                            Interests
                                                </h5>
                                        <hr />
                                        <br />
                                        {profile && profile.interests.map(function (item, i) {
                                            return <ul key={i}><li>{item}</li></ul>
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="col xs12 s12 m12 l12">
                                <div className="card animate fadeLeft uicards_card4 cardStyle">
                                    <div className="card-content">
                                        <h5 className="card-stats-number"
                                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                            Achievements
                                                </h5>
                                        <hr />
                                        <br />
                                        {profile && profile.achievements.map(function (item, i) {
                                            return <ul key={i}><li>{item}</li></ul>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* )} */}
                    </aside>
                </div>
            </div >
            <Route path="/editcreateprofile" component={EditCreateProfile} />
        </BrowserRouter >
    )
}


UserProfile.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    getProfilePhoto: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default withRouter(connect(mapStateToProps, { getCurrentProfile, getProfilePhoto })(UserProfile))

