import React, { Fragment, useEffect } from 'react'
import { withRouter, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Popup from "reactjs-popup"
import moment from "moment";
import Loader from 'react-loader-spinner'
import { BackendInstance } from '../../config/axiosInstance';
import { defaultAvatar } from '../../config/default';


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
                                <img
                                    className="myprofileimg center"
                                    src={profile && profile.path ?`${BackendInstance.defaults.baseURL}${profile && profile.path}`: defaultAvatar}
                                    alt=""
                                />
                                <div className="">
                                    <Popup
                                        trigger=
                                        {
                                            <div className="overlay">
                                                <a href="#" className="btn icon">
                                                    <i className="fas fa-edit small"></i>
                                                </a>
                                            </div>
                                            /* <center>
                                                <i className="fas fa-edit fa-2x overlay larger" />
                                            </center> */
                                        }
                                        modal
                                        closeOnDocumentClick
                                    >
                                        <div className="uicards" style={{ backgroundColor: "black", zIndex:9999 }} >
                                            <ImageUpload />
                                        </div>
                                    </Popup>
                                </div>
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
                                    <div className="col s12 m12 l6">
                                        <p className=' lead white-text left' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS" }}>
                                            {user && user.firstname}&nbsp;{user && user.lastname}
                                        </p>
                                    </div>

                                    <div className="col s12 m12 l6">
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
                                                            <i className="fas fa-edit white-text" title="Edit Profile" /> Edit
                                                        </a>
                                                        : <a href="/editorcreateprofile" className="btn btn-primary">
                                                            <i className="fas fa-edit white-text" title="Edit Profile" /> Edit
                                                        </a>
                                                    }
                                                    &nbsp;
                                                    <Popup
                                                        className="popup"
                                                        style={{ height: "50vh", marginTop: '45%' }}
                                                        trigger=
                                                        {
                                                            <button className="btn btn-success right">
                                                                <i className="fas fa-info-circle white-text" title="About" /> About
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

                                <div className="row">
                                    <div className="col s12 m12 l12">
                                        {loading || profile === null ? (
                                            <div></div>

                                        ) : (
                                                <div className="white-text left" >
                                                    <p style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                                        {profile && profile.status} at {profile && profile.company}
                                                    </p>
                                                    <p style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                                        {profile && profile.city}
                                                    </p>
                                                </div>
                                            )}
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
                                {profile && profile.bio === null ?
                                    (<p className=" white-text text-lighten-5">
                                        Bio not added.
                                    </p>
                                    ) : (
                                        <p className=" white-text text-lighten-5">
                                            {profile && profile.bio}
                                        </p>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="s12 m12 l12">
                        {loading || profile === null ? (
                            <div></div>

                        ) : (
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
                                                {profile && profile.skills.map(function (item, i) {
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
                                                {profile && profile.interests.map(function (item, i) {
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
                                                {profile && profile.achievements.map(function (item, i) {
                                                    return <ul><li>{item}</li></ul>
                                                })}
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            )}
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
                           {/* { console.log(profile.education.length)} */}
                            {profile && profile.education && profile.education.length > 0 ? (
                                
                                <Fragment>
                                    <h6 htmlFor="Education" className="white-text center ">Studied at</h6>
                                    <br />
                                </Fragment>

                            ) : (
                                <Fragment>
                                    <div className="white-text">No Education Added</div>
                                    <br />
                                    </Fragment>
                                )}
                            {profile && profile.education.map(function (item, i) {
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
                            {profile && profile.experience ? (
                                <Fragment>
                                    <h6 htmlFor="Experience" className="white-text center ">Worked at</h6>
                                    <br/>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <div className="white-text">No Experience Added</div>
                                    <br />
                                </Fragment>
                                )}
                            {profile &&
                                profile.experience.map(function (item, i) {
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





































                {/* <div className="card-user">
                    <div className="author">
                        <div className="block block-one" />
                        <div className="block block-two" />
                        <div className="block block-three" />
                        <div className="block block-four" />
                    </div>
                </div>
            </div>

            <div className="container">

                <div className="card card-body uicards" >
                    <div className="row">
                        <div className="col s12 m12 l4 center pic">
                            <br />
                            <br />
                            <img
                                className="round-img round center"
                                style={{ borderRadius: '50%', width: '180px' }}
                                src={user && user.avatar} //`/uploads/${profile && profile.path}`
                                alt=""
                            />
                            <div className=" white-text center">
                                <Popup
                                    className="popup"
                                    style={{ height: "50vh", marginTop: '45%', backgroundColor: "black" }}
                                    trigger=
                                    {
                                        <center>
                                            <i className="fas fa-edit center white-text larger" /><br />
                                        </center>
                                    }
                                    modal
                                    closeOnDocumentClick
                                >
                                    <div className="uicards" style={{ backgroundColor: "black" }}>
                                        <ImageUpload />
                                    </div>
                                </Popup>
                            </div>
                            <br />
                            <br />

                            <div className="icons my-1 white-text center">
                                <a href="#!" target="_blank" title="Githubusername" rel="noopener noreferrer">
                                    <i className="fas fa-globe fa-2x white-text center"></i>
                                </a>
                                &nbsp; &nbsp;
                                <a href="#!" className="btn-icon btn-round" target="_blank" title="twitter" rel="noopener noreferrer">
                                    <i className="fab fa-twitter fa-2x white-text "></i>
                                </a>
                                &nbsp; &nbsp;
                                <a href="#!" target="_blank" title="facebook" rel="noopener noreferrer">
                                    <i className="fab fa-facebook fa-2x white-text "></i>
                                </a>
                                &nbsp; &nbsp;
                                <a href="#!" target="_blank" title="linkedin" rel="noopener noreferrer">
                                    <i className="fab fa-linkedin fa-2x white-text "></i>
                                </a>
                                &nbsp; &nbsp;
                                <a href="#!" target="_blank" title="youtube" rel="noopener noreferrer">
                                    <i className="fab fa-youtube fa-2x white-text "></i>
                                </a>
                                &nbsp; &nbsp;
                                <a href="#!" target="_blank" title="instagram" rel="noopener noreferrer">
                                    <i className="fab fa-instagram fa-2x white-text "></i>
                                </a>
                                <br />
                                <br />
                            </div>
                        </div>

                        <div className="col s12 m12 l8">
                            <br /><br />
                            <div className="row">
                                <div className="col s12 m12 l12">
                                    <p className='large white-text left' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS" }}>
                                        {user && user.firstname}&nbsp;{user && user.lastname}
                                    </p>
                                </div>
                            </div>

                            {loading || profile === null ? (
                                <div className="row white-text">
                                    <div className="col s12 m12 l12">
                                        <p>No profile found.</p>
                                        {role && role === "manager" ?
                                            <a href="/editcreateprofile" className="btn btn-danger">
                                                <i className="fas fa-edit circle white-text" title="Create Profile" /> Create Profile
                                            </a>
                                            : <a href="/editorcreateprofile" className="btn btn-danger">
                                                <i className="fas fa-edit circle white-text" title="Create Profile" /> Create Profile
                                            </a>
                                        }
                                        <br />
                                    </div>
                                </div>

                            ) : (
                                    <div className="white-text left" style={{ marginLeft: "2%" }}>
                                        <h6 className="white-text"
                                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                            {profile && profile.status}
                                        </h6>
                                        <br />

                                        {role && role === "manager" ?
                                            <a href="/editcreateprofile" className="btn btn-primary">
                                                <i className="fas fa-edit circle round white-text" title="Edit Profile" /> Edit Profile
                                            </a>
                                            : <a href="/editorcreateprofile" className="btn btn-primary">
                                                <i className="fas fa-edit circle round white-text" title="Edit Profile" /> Edit Profile
                                            </a>
                                        }

                                        &nbsp;&nbsp;
                                        <Popup
                                            className="popup"
                                            style={{ height: "50vh", marginTop: '45%' }}
                                            trigger=
                                            {
                                                <button className="btn btn-success">
                                                    <i className="fas fa-page circle white-text" title="About" /> About
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
                                                        <p><b>Website:</b> {profile && profile.website}</p>
                                                        <p><b>company:</b>{profile && profile.company}, {profile && profile.location}</p>
                                                        <p><b>HomeTown:</b> {profile && profile.hometown}</p>
                                                        <p><b>City:</b> {profile && profile.city}</p>
                                                    </div>
                                                    <div className="right">
                                                        <a href="/editcreateprofile" className="btn btn-success">
                                                            <i className="fas fa-edit circle round white-text" title="Edit Profile" /> Edit Profile
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popup>
                                        <br />
                                        <br />
                                        <div className="col s12 m12 l12" style={{ marginLeft: "-3%", fontSize: "14px" }} >
                                            <p><b>Date of Birth: </b>{moment(new Date(profile && profile.dob)).format('YYYY-MM-DD')}</p>
                                            <p><b>Email:</b> {user && user.email}</p>
                                            <br />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {loading || profile === null ? (

                    <div className="center">
                        <br />
                        <br />
                        <Loader className="center" type="BallTriangle" color="cyan" height={80} width={80} />
                    </div>
                ) : (
                        <Fragment>
                            <ul className="row">
                                <li className="col s12 m5 l5">
                                    <h6 className="white-text"
                                        style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                        Skills
                                        </h6>
                                    <div className="card animate fadeLeft ">
                                        <p color="yellow lighten-1" width="100%" style={{ borderTop: "5px solid blue" }} />
                                        <div className="card-action grey darken-3">
                                            <div className=" white-text text-lighten-5">
                                                {profile && profile.skills.map(function (item, i) {
                                                    return <ul><li>{item}</li></ul>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div style={{ marginTop: "40px" }}>
                                        <h6 className="white-text"
                                            style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                            Interests
                                        </h6>
                                        <div className="card animate fadeLeft ">
                                            <p color="yellow lighten-1" width="100%" style={{ borderTop: "5px solid orange" }} />
                                            <div className="card-action grey darken-3">
                                                <div className=" white-text text-lighten-5">

                                                    {profile && profile.interests.map(function (item, i) {
                                                        return <ul><li>{item}</li></ul>
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="col s0 m1 l1 offset-m1 offset-l1">
                                    <div className="center" style={{ borderLeft: "5px solid white", height: '400px' }}></div>
                                </li>
                                <li className="col s12 m5 l5" style={{ marginTop: "90px" }}>
                                    <h6 className="white-text"
                                        style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                        Achievements
                                    </h6>
                                    <div className="card animate fadeLeft ">
                                        <p color="yellow lighten-1" width="100%" style={{ borderTop: "5px solid green" }} />
                                        <div className="card-action grey darken-3">
                                            <div className=" white-text text-lighten-5">
                                                {profile && profile.achievements.map(function (item, i) {
                                                    return <ul><li>{item}</li></ul>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <div className="row">
                                <div className="col s12 m12 l12">
                                    <h4 className="white-text"
                                        style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                        Bio
                                    </h4>
                                    <div className="card animate fadeLeft ">
                                        <p color="yellow lighten-1" width="100%" style={{ borderTop: "5px solid brown" }} />
                                        <div className="card-action grey darken-3">
                                            <p className=" white-text text-lighten-5">
                                                {profile && profile.bio}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col s12 m6 l6">
                                    <h4 className="white-text"
                                        style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                        Education
                                    </h4>
                                    <div className="card animate fadeLeft grey darken-4 white-text center ">
                                        <p color=" lighten-1" width="100%" style={{ borderTop: "5px solid red" }} />
                                        <br />
                                        <i className="fas fa-graduation-cap fa-3x white-text center"></i>
                                        {profile && profile.education ? (
                                            <h6 htmlFor="Education" className="white-text center ">Studied at</h6>

                                        ) : (
                                                <div className="white-text">No Education Added</div>


                                            )}

                                        {profile && profile.education.map(function (item, i) {
                                            return (
                                                <div key={`${item}-${i}`}>
                                                    <br /><b>
                                                        {item.school}
                                                    </b>
                                                    <label className="white-text lighten-1 center" key={`${item}-${i}`}>
                                                        <br /><b>{item && item.degree} {item && item.fieldofstudy}</b>
                                                        <br />  From {moment(new Date(item && item.educationfrom)).format('YYYY-MM-DD')} To   {item.educationcurrent ? (
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
                                    <h4 className="white-text"
                                        style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                        Experience
                                    </h4>
                                    <div className="card animate fadeLeft grey darken-4 white-text center">
                                        <p color=" lighten-1" width="100%" style={{ borderTop: "5px solid red" }} />
                                        <br />
                                        <i className="fas fa-ribbon fa-3x white-text center"></i>
                                        {profile && profile.experience ? (
                                            <h6 htmlFor="Experience" className="white-text center ">Worked at</h6>

                                        ) : (
                                                <div className="white-text">No Experience Added</div>
                                            )}
                                        {profile &&


                                            profile.experience.map(function (item, i) {
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

                        </Fragment>
                    )} */}

            </div>
            <Route path="/editcreateprofile" component={EditCreateProfile} />
        </BrowserRouter>
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

