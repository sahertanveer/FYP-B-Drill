import React, { Fragment, useEffect } from 'react'
import { withRouter, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from "moment";
import { BackendInstance } from '../../config/axiosInstance';
import { getProfileById } from '../../actions/profileAction'
import queryString from 'query-string'
import { defaultAvatar } from '../../config/default';
import Loader from 'react-loader-spinner'

import Card from '../common/cards/Card';
import CardHeader from '../common/cards/CardHeader';
import CardIcon from "../common/cards/CardIcon.js";
import CardFooter from "../common/cards/CardFooter.js";

//  const location =useLocation()


const BioProfile = ({ getProfileById, auth: { user }, profile: { userprofile } }) => {
    const nullProfile = !userprofile;
    const values = queryString.parse(window.location.search)

    useEffect(() => {

        console.log(values)
        getProfileById(values.role, values.userId);
    }, [getProfileById, nullProfile])
    if (userprofile === null) {
        return (<div className="white-text center">
            <Loader color="#00BFFF" height={100} width={100} timeout={0} /> <br></br>
        Fetching User Profile
        </div>);
    }
    else
        return (

            <BrowserRouter>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col s12 m12 l12">
                            <div className="card animate fadeLeft uicards">
                                <div className="card-content">

                                    <div className="row">
                                        <div className="col s12 m7 l7">
                                            <div className="userimagedisplayed center">
                                                <img className="myprofileimgdisplayed center" src={userprofile && userprofile.path ? `${BackendInstance.defaults.baseURL}${userprofile && userprofile.path}` : defaultAvatar}
                                                    alt=''

                                                />
                                            </div>
                                        </div>

                                        <div className="col s12 m5 l5">
                                            <p>Hello everybody, I'm</p>
                                            <h2 className=' white-text' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS", marginTop: "-1px" }}>
                                                {values.role === "candidate" ? (userprofile && userprofile.user && userprofile.user.firstname) :
                                                    (userprofile && userprofile.manager && userprofile.manager.firstname)}
                                            &nbsp;
                                            {values.role === "candidate" ? (userprofile && userprofile.user && userprofile.user.lastname) :
                                                    (userprofile && userprofile.manager && userprofile.manager.lastname)}

                                            </h2>
                                            <div className="white-text" >
                                                <p style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                                    {userprofile && userprofile.status} at {userprofile && userprofile.company}&nbsp;{userprofile && userprofile.city}
                                                </p>
                                            </div>
                                            <br/>
                                            <div className="white-text" >
                                            <p><i>Email:</i> {user && user.email}</p>
                                            <p><i>Phone:</i> {userprofile && userprofile.contact}</p>
                                            <p><i>Website:</i> {userprofile && userprofile.website}</p>
                                            <p><i>Date of Birth: </i>{moment(new Date(userprofile && userprofile.dob)).format('YYYY-MM-DD')}</p>
                                            <p><i>HomeTown:</i> {userprofile && userprofile.hometown}</p>
                                            </div>
                                            <br />
                                            <div className="icons my-1 white-text">
                                                <a href="#!" className="btn linkbtn" target="_blank" title="github" rel="noopener noreferrer">
                                                    <i className="fas fa-globe fa-1x white-text "></i>
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
                            </div>
                        </div>


                    <div className="row">
                        <div className="col s12 m12 l12">
                            <Card>
                                <CardHeader color="primary" stats icon>
                                    <CardIcon color="primary">
                                        <i className="fa fa-user-secret fa-3x white-text center"></i>
                                    </CardIcon>
                                    <br />
                                    <h5>Bio</h5>
                                </CardHeader>
                                <CardFooter >
                                    {userprofile && userprofile.bio ?
                                        (
                                            <p className=" white-text text-lighten-5">
                                                {userprofile && userprofile.bio}
                                            </p>
                                        ) : (
                                            <p className=" white-text text-lighten-5">
                                            Bio not added.
                                        </p>
                                         
                                        )
                                    }
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>


                    <div className="row">
                        <div className="s12 m12 l12">
                            <div className="row">
                                <div className="col s12 m4 l4">
                                    <div className="card animate fadeLeft uicards_card1 cardStyle">
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
                                    <div className="card animate fadeLeft uicards_card2 cardStyle">
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
                                    <div className="card animate fadeLeft uicards_card4 cardStyle">
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
                        <div className="col xs12 s12 m6 l6">
                            <Card>
                                <CardHeader color="success" stats icon>
                                    <CardIcon color="success">
                                        <i className="fas fa-graduation-cap fa-3x white-text center"></i>
                                    </CardIcon>
                                    <br />
                                    <h5>Education</h5>
                                </CardHeader>
                                <CardFooter >
                                    {userprofile && userprofile.education && userprofile.education.length > 0 ? (
                                        <Fragment>
                                            <h6 htmlFor="Education" className="white-text center ">Studied at</h6>
                                            {userprofile &&
                                                userprofile.education.map(function (item, i) {
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
                                        </Fragment>
                                    ) : (
                                            <div className="white-text">No Education Added</div>
                                        )}

                                </CardFooter>
                            </Card>
                        </div>

                        <div className="col xs12 s12 m6 l6">
                            <Card>
                                <CardHeader color="info" stats icon>
                                    <CardIcon color="info">
                                        <i className="fas fa-ribbon fa-3x white-text center"></i>
                                    </CardIcon>
                                    <br />
                                    <h5>Experience</h5>
                                </CardHeader>
                                <CardFooter >
                                    {userprofile && userprofile.experience  && userprofile.experience.length > 0 ? (
                                        <Fragment>
                                            <h6 htmlFor="Experience" className="white-text center ">Worked at</h6>
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
                                        </Fragment>
                                    ) : (
                                            <div className="white-text">No Experience Added</div>
                                        )}

                                </CardFooter>
                            </Card>
                        </div>

                    </div>

                </div>
            </BrowserRouter>
        )
}

BioProfile.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default withRouter(connect(mapStateToProps, { getProfileById })(BioProfile))

