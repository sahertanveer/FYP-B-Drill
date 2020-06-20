import React, { Fragment, useEffect } from 'react'
import { withRouter, BrowserRouter } from 'react-router-dom';
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
import CardBody from "../common/cards/CardBody.js";

//  const location =useLocation()

const BioProfile = ({ getProfileById, auth: { user }, profile: { userprofile, loading } }) => {
    const nullProfile = !userprofile;
    const values = queryString.parse(window.location.search)

    useEffect(() => {
        getProfileById(values.role, values.userId);
    }, [getProfileById, nullProfile])
    if (userprofile === null && loading) {
        return (<div className="white-text center">
            <Loader color="#00BFFF" height={100} width={100} timeout={0} /> <br></br>
                <p>Fetching User Profile</p>
        </div>);
    }
    else if (userprofile === null && !loading) {
        return(<div className="white-text center">
            No Profile Found!
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
                                        <div className="col s12 m12 l7">
                                            <div className="userimagedisplayed center">
                                                <img className="myprofileimgdisplayed center" src={userprofile && userprofile.path ? `${BackendInstance.defaults.baseURL}${userprofile && userprofile.path}` : defaultAvatar}
                                                    alt=''

                                                />
                                            </div>
                                        </div>

                                        <div className="col s12 m12 l5">
                                            <br />
                                            <div className="row">
                                                <div className="col s12 m12 l12">
                                                    <h2 className=' white-text' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS", marginTop: "-1px" }}>
                                                        {values.role === "candidate" ? (userprofile && userprofile.user && userprofile.user.firstname) :
                                                            (userprofile && userprofile.manager && userprofile.manager.firstname)
                                                        }
                                                    </h2>
                                                    {/* &nbsp; */}
                                                    <h2 className=' white-text' style={{ textTransform: 'capitalize', fontFamily: "Comic Sans MS", marginTop: "-1px" }}>
                                                        {values.role === "candidate" ? (userprofile && userprofile.user && userprofile.user.lastname) :
                                                            (userprofile && userprofile.manager && userprofile.manager.lastname)
                                                        }
                                                    </h2>
                                                </div>
                                                <div className="col s12 m12 l12">
                                                    <div className="white-text" >
                                                        <p style={{ textTransform: 'capitalize', fontFamily: 'Lucida Sans Typewriter' }}>
                                                            {userprofile && userprofile.status} at {userprofile && userprofile.company}&nbsp;{userprofile && userprofile.city}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col s12 m12 l12">
                                                    <br />
                                                    <div className="white-text" >
                                                        <p><i>Email:</i> {user && user.email}</p>
                                                        <p><i>Phone:</i> {userprofile && userprofile.contact}</p>
                                                        <p><i>Website:</i> {userprofile && userprofile.website}</p>
                                                        <p><i>Date of Birth: </i>{moment(new Date(userprofile && userprofile.dob)).format('YYYY-MM-DD')}</p>
                                                        <p><i>HomeTown:</i> {userprofile && userprofile.hometown}</p>
                                                    </div>
                                                </div>
                                                <div className="col s12 m12 l12">
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
                                            {userprofile && userprofile.education && userprofile.education.length > 0 ? (
                                                <Fragment>
                                                    {/* <p htmlFor="Education" className="white-text center ">Studied at</p> */}
                                                    {userprofile &&
                                                        userprofile.education.map(function (item, i) {
                                                            return (
                                                                <div className="white-text gray center" key={`${item}-${i}`}>
                                                                    <br />
                                                                    <p htmlFor="Education" className="white-text center ">Studied at</p>
                                                                    <h5>{item.school}</h5>
                                                                    <p className="white-text center" key={`${item}-${i} degree`}>
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
                                            {userprofile && userprofile.experience && userprofile.experience.length > 0 ? (
                                                <Fragment>
                                                    {userprofile &&
                                                        userprofile.experience.map(function (item, i) {
                                                            return (
                                                                <div className="white-text lighten-1 center" key={`${item}-${i}`}>
                                                                    <p htmlFor="Experience" className="white-text center ">Worked as</p>
                                                                    <h5>{item.jobtitle} </h5>
                                                                    <p className="white-text lighten-1 center" key={`${item}-${i}`}>
                                                                        <br />at {item.jobcompany}, {item && item.joblocation}
                                                                        <br />
                                                                            from {moment(new Date(item && item.jobfrom)).format('YYYY-MM-DD')}
                                                                         &nbsp; to {item.jobcurrent ? <>Current</> :
                                                                                moment(new Date(item && item.jobto)).format('YYYY-MM-DD')}
                                                                    
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
                                            {userprofile && userprofile.skills.map(function (item, i) {
                                                return <ul key={`skill-${i}`}><li>{item}</li></ul>
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
                                            {userprofile && userprofile.interests.map(function (item, i) {
                                                return <ul key={`interest-${i}`}><li>{item}</li></ul>
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
                                            {userprofile && userprofile.achievements.map(function (item, i) {
                                                return <ul key={`achievement-${i}`}><li>{item}</li></ul>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>



                </div>
            </BrowserRouter>
        )
}

BioProfile.propTypes = {
    // getCurrentProfile: PropTypes.func.isRequired,
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default withRouter(connect(mapStateToProps, { getProfileById })(BioProfile))

