import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, BrowserRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from "moment";
import Alert from '../../layout/Alert'
import { setPage } from '../../actions/pageAction'

import Card from '../common/cards/Card';
import CardHeader from '../common/cards/CardHeader';
import CardIcon from "../common/cards/CardIcon.js";
import CardBody from "../common/cards/CardBody"
import CardFooter from "../common/cards/CardFooter.js";

import { createorupdateProfile, getCurrentProfile } from '../../actions/profileAction';

const EditCreateProfile = ({ profile: { profile, loading }, auth: { user, role, organization_id, manager_id }, createorupdateProfile, getCurrentProfile, setPage }) => {

    const history = useHistory()
    const [formData, setFormData] = useState({
        organization_id: organization_id,
        manager_id: (role === "candidate" ? manager_id : null),
        dob: '',
        areacode: '',
        phone: '',
        website: '',
        hometown: '',
        city: '',
        bio: '',
        status: '',
        company: '',
        location: '',
        skills: '',
        interests: '',
        achievements: '',
        githubusername: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        instagram: '',
        education: [],
        experience: [],
        social: {}
    });

    const [displaySocialInputs, toggleSocialInputs] = useState(false);

    const [educationFields, setEducationFields] = useState([]);
    const [experienceFields, setExperienceFields] = useState([]);


    useEffect(() => {
        console.log(formData)
        // if (role==="candidate"){
        //     setFormData({ ...formData, manager_id: manager_id });
        // }
        console.log(formData)
        if (!profile) getCurrentProfile();
        if (!loading) {
            const profileData = { ...formData };
            console.log(profile)
            for (const key in profile) {


                if (key === "contact") { //profileData has no contact as a key
                    let contactArray = profile.contact.split('-');
                    profileData.areacode = contactArray[0]
                    profileData.phone = contactArray[1]
                }

                // second condition for manger_id and organization_id as they are null by default in
                // mongoose model and are not set by user, so in form they are gain appended as null
                // so for data that are by default null and are set automatically by system, not by 
                // user, the second condition is usefull

                if (key in profileData && profile[key] !== null) {
                    profileData[key] = profile[key];
                }
                console.log(profileData)


            }
            if (profileData && profileData.skills && Array.isArray(profileData.skills)) {
                profileData.skills = profileData.skills.join(",");
            }
            if (profileData && profileData.achievements && Array.isArray(profileData.achievements)) {
                profileData.achievements = profileData.achievements.join(",");
            }
            if (profileData && profileData.interests && Array.isArray(profileData.interests)) {
                profileData.interests = profileData.interests.join(",");
            }

            if (profile && profile.social) {
                toggleSocialInputs(true);
                console.log(social)
            }

            if (profile && profile.education) {
                setEducationFields(profile.education)
            }
            if (profile && profile.experience) {
                setExperienceFields(profile.experience)
            }
            console.log(profileData)
            setFormData(profileData);
        }
    }, [loading, getCurrentProfile, profile]);

    const { dob, areacode, phone, hometown, city, website, bio, status, company, location,
        skills, interests, achievements, social
    } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    function onSocialChange(e) {
        const values = { ...formData };
        values.social[e.target.name] = e.target.value;
        setFormData({ ...formData, values });
    }

    function onEducationChange(i, e) {
        const values = [...educationFields];
        if (e.target.name === "educationcurrent")
            values[i][e.target.name] = !values[i][e.target.name]
        else
            values[i][e.target.name] = e.target.value;
        setEducationFields(values);
    }

    function onExperienceChange(i, e) {

        const values = [...experienceFields];
        if (e.target.name === "jobcurrent")
            values[i][e.target.name] = !values[i][e.target.name]
        else
            values[i][e.target.name] = e.target.value;
        setExperienceFields(values);
    }

    function handleEducationAdd() {
        const values = [...educationFields];
        values.push({
            school: '',
            degree: '',
            fieldofstudy: '',
            educationfrom: '',
            educationto: '',
            educationcurrent: false,
            educationdescription: '',
        });
        setEducationFields(values);
        let formValues = { ...formData };
        formValues.education.push(values[values.length - 1])
        setFormData(formValues)
        console.log(educationFields)

    }

    function handleExperienceAdd() {
        const values = [...experienceFields];
        values.push({
            jobtitle: '',
            jobcompany: '',
            joblocation: '',
            jobefrom: '',
            jobto: '',
            jobcurrent: false,
            jobdescription: ''
        });

        setExperienceFields(values);
        let formValues = { ...formData };
        formValues.experience.push(values[values.length - 1])
        setFormData(formValues)

    }

    function handleEducationRemove(i) {
        const values = [...educationFields];
        values.splice(i, 1);
        setEducationFields(values);
        let formValues = { ...formData };
        formValues.education.splice(i, 1)
        setFormData(formValues)
    }

    function handleExperienceRemove(i) {
        const values = [...experienceFields];
        values.splice(i, 1);
        setExperienceFields(values);
        let formValues = { ...formData };
        formValues.experience.splice(i, 1)
        setFormData(formValues)
    }

    const onSubmit = e => {
        e.preventDefault();
        console.log(formData)
        createorupdateProfile(formData, true);
        if (role && role === "manager") {
            history.push('/managerprofile');
            setPage('managerprofile');
        }
        else {
            history.push('/candprofile');
            setPage('candprofile')
        }

        // history.push('/CandProfile');
    };

    // function handleChange(i, event) {
    //     const values = [...fields];
    //     values[i].value = event.target.value;
    //     setFields(values);
    // }

    // function handleAdd() {
    //     const values = [...fields];
    //     console.log(values)
    //     values.push({ value: null });
    //     console.log(values)
    //     setFields(values);
    // }

    // function handleRemove(i) {
    //     const values = [...fields];
    //     values.splice(i, 1);
    //     setFields(values);
    // }

    return (
        <BrowserRouter>
            <div className="container-fluid uicards">
                <div className="row">
                    <div className="col s12 m12 l12">
                        <h5 className="card-stats-number white-text" style={{ fontFamily: "Princess Sofia" }}>Profile</h5>
                        <hr />
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col s12 m12 l12">
                            <form className="form" onSubmit={onSubmit}>
                                {/* <div className="grey darken-4" style={{padding:"20px"}}> */}
                                <Card style={{ border: "1px solid #fff" }}>
                                    <CardHeader color="primary" stats icon>
                                        <CardIcon color="primary">
                                            <h5>Personal Information</h5>
                                        </CardIcon>
                                        <br />
                                        <p className="cyan-text"> &nbsp;* = required field </p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row ">
                                            <div className="form-group">
                                                <div className="col s3 m2 l2">
                                                    <label className="right control-label white-text"
                                                        style={{ fontSize: '15px' }} htmlFor="FirstName">Full Name: *
                                        </label>
                                                </div>
                                                <div className="col s3 m3 l3">
                                                    <input
                                                        type="text"
                                                        className="form-control white-text "
                                                        name="firstname"
                                                        placeholder="First Name"
                                                        defaultValue={user && user.firstname}
                                                        onChange={e => onChange(e)}
                                                        required
                                                    />
                                                </div>

                                                <div className="col s3 m3 l3">
                                                    <input
                                                        type="text"
                                                        className="form-control white-text "
                                                        name="middlename"
                                                        placeholder="Middle Name"
                                                        defaultValue={user && user.middlename}
                                                        onChange={e => onChange(e)}
                                                    />
                                                </div>

                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="text"
                                                        className="form-control white-text "
                                                        name="lastname"
                                                        placeholder="Last Name"
                                                        defaultValue={user && user.lastname}
                                                        onChange={e => onChange(e)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group">
                                                <div className="col s3 m2 l2">
                                                    <label className="right control-label white-text"
                                                        style={{ fontSize: '15px' }} htmlFor="dob">Date of Birth: *
                                        </label>
                                                </div>
                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="date"
                                                        className="form-control white-text "
                                                        name="dob"
                                                        placeholder="Date of Birth"
                                                        defaultValue={profile && profile.dob ? moment(new Date(dob)).format('YYYY-MM-DD') : ""}
                                                        onChange={e => onChange(e)}
                                                        required
                                                    />
                                                </div>

                                                <div className="col s3 m2 l2">
                                                    <label className="right control-label white-text"
                                                        style={{ fontSize: '15px' }} htmlFor="contact">Contact: *
                                            </label>
                                                </div>
                                                <div className="col s1 m1 l1">
                                                    <input
                                                        type="number"
                                                        className="form-control white-text "
                                                        name="areacode"
                                                        placeholder="00"
                                                        defaultValue={areacode}
                                                        onChange={e => onChange(e)}
                                                        required
                                                    />
                                                    <small className="form-text grey-text">
                                                        Area Code
                                        </small>
                                                </div>

                                                <div className="col s2 m3 l3">
                                                    <input
                                                        type="text"
                                                        className="form-control white-text "
                                                        name="phone"
                                                        placeholder="Phone No."
                                                        defaultValue={phone}
                                                        onChange={e => onChange(e)}
                                                    />
                                                    <small className="form-text grey-text">
                                                        Phone
                                        </small>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group">
                                                <div className="col s3 m2 l2">
                                                    <label className="right control-label white-text"
                                                        style={{ fontSize: '15px' }} htmlFor="dob">Email: *
                                        </label>
                                                </div>
                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="email"
                                                        className="form-control white-text "
                                                        name="email"
                                                        placeholder="Email Address"
                                                        defaultValue={user && user.email}
                                                        onChange={e => onChange(e)}
                                                        required
                                                    />
                                                </div>

                                                <div className="col s3 m2 l2">
                                                    <label className="right control-label white-text"
                                                        style={{ fontSize: '15px' }} htmlFor="website">Website:
                                        </label>
                                                </div>
                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="text"
                                                        className="form-control white-text "
                                                        placeholder="Website"
                                                        name="website"
                                                        defaultValue={website}
                                                        onChange={onChange}
                                                    />
                                                    <small className="form-text grey-text">
                                                        Could be your own or a company website
                                        </small>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <div className="col s3 m2 l2">
                                                <label className="right control-label white-text"
                                                    style={{ fontSize: '15px' }} htmlFor="Bio">Bio:
                                    </label>
                                            </div>
                                            <div className="col s9 m10 l10">
                                                <textarea
                                                    type="text"
                                                    className="form-control white-text "
                                                    name="bio"
                                                    placeholder="A short bio of yourself"
                                                    defaultValue={bio}
                                                    onChange={e => onChange(e)}
                                                />
                                                <small className="form-text grey-text">Tell us a little about yourself</small>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="form-group">
                                                <div className="col s3 m2 l2">
                                                    <label className="right control-label white-text"
                                                        style={{ fontSize: '15px' }} htmlFor="HomeTown">Home Town:
                                        </label>
                                                </div>
                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="text"
                                                        className="white-text"
                                                        placeholder="Home Town"
                                                        name="hometown"
                                                        value={hometown}
                                                        onChange={onChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row form-group">
                                                <div className="col s3 m2 l2">
                                                    <label className="right control-label white-text"
                                                        style={{ fontSize: '15px' }} htmlFor="City">City/Country: *
                                        </label>
                                                </div>
                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="text"
                                                        className="form-control white-text "
                                                        name="city"
                                                        placeholder="City, Country"
                                                        value={city}
                                                        onChange={e => onChange(e)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group">
                                                <div className="col s3 m2 l2">
                                                    <label className="right control-label white-text"
                                                        style={{ fontSize: '15px' }} htmlFor="LastName">Status: *
                                        </label>
                                                </div>
                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="text"
                                                        className="white-text"
                                                        placeholder="Status"
                                                        name="status"
                                                        value={status}
                                                        onChange={onChange}
                                                        required
                                                    />
                                                    <small className="form-text grey-text">
                                                        Give us an idea of where you are at in your career
                                        </small>
                                                </div>
                                            </div>

                                            <div className="row form-group">
                                                <div className="col s3 m2 l2">
                                                    <label className="right control-label white-text"
                                                        style={{ fontSize: '15px' }} htmlFor="LastName">Company: *
                                        </label>
                                                </div>
                                                <div className="col s3 m4 l4">
                                                    <input
                                                        type="text"
                                                        className="form-control white-text "
                                                        name="company"
                                                        placeholder="Company"
                                                        value={company}
                                                        onChange={e => onChange(e)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <div className="col s4 m3 l2">
                                                <label className="right control-label white-text"
                                                    style={{ fontSize: '15px' }} htmlFor="Location">Location: *
                                    </label>
                                            </div>
                                            <div className="col s8 m9 l10">
                                                <input
                                                    type="text"
                                                    className="form-control white-text "
                                                    name="location"
                                                    placeholder="Location"
                                                    value={location}
                                                    onChange={e => onChange(e)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <Card style={{ border: "1px solid #fff" }}>
                                    <CardHeader color="info" stats icon>
                                        <CardIcon color="info">
                                            <h5>Other Information</h5>
                                        </CardIcon>
                                        <br />
                                        <p className="cyan-text"> &nbsp;* = required field </p>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row form-group">
                                            <div className="col s4 m3 l2">
                                                <label className="right control-label white-text"
                                                    style={{ fontSize: '15px' }} htmlFor="Skills">Skills: *
                                    </label>
                                            </div>
                                            <div className="col s8 m9 l10">
                                                <input
                                                    type="text"
                                                    className="form-control white-text "
                                                    placeholder="Skills"
                                                    name="skills"
                                                    defaultValue={skills}
                                                    onChange={onChange}
                                                    required
                                                />

                                                <small className="form-text grey-text">
                                                    Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
                                    </small>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <div className="col s3 m2 l2">
                                                <label className="right control-label white-text"
                                                    style={{ fontSize: '15px' }} htmlFor="Achievements">Achievements: *
                                    </label>
                                            </div>
                                            <div className="col s8 m9 l10">
                                                <input
                                                    type="text"
                                                    className="form-control white-text "
                                                    placeholder="Achievements"
                                                    name="achievements"
                                                    defaultValue={achievements}
                                                    onChange={onChange}
                                                    required
                                                />
                                                <small className="form-text grey-text">
                                                    Add certificates, awards, scholarships and so on
                                    </small>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <div className="col s3 m2 l2">
                                                <label className="right control-label white-text"
                                                    style={{ fontSize: '15px' }} htmlFor="Interests">Interests: *
                                    </label>
                                            </div>
                                            <div className="col s8 m9 l10">
                                                <input
                                                    type="text"
                                                    className="form-control white-text "
                                                    placeholder="Interests"
                                                    name="interests"
                                                    defaultValue={interests}
                                                    onChange={onChange}
                                                    required
                                                />
                                                <small className="form-text grey-text">
                                                    Add certificates, awards, scholarships and so on
                                    </small>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="my-2">
                                    <button
                                        onClick={() => toggleSocialInputs(!displaySocialInputs)}
                                        type="button"
                                        className="btn btn-success"
                                    >
                                        Add Social Network Links
                                </button>
                                    <br />
                                    <span className="grey-text">Click on button to add social information</span>
                                </div>

                                {displaySocialInputs && (
                                    <Fragment>
                                        <br />
                                        <Card style={{ border: "1px solid #fff" }}>
                                            <CardHeader color="success" stats icon>
                                                <CardIcon color="success">
                                                    <h5>Social Information</h5>
                                                </CardIcon>
                                                <br />
                                                <p className="cyan-text"> &nbsp;* = required field </p>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="row form-group social-input">
                                                    <div className="col s2 m2 l2">
                                                        <i className="fab fa-github fa-2x right control-label white-text" />
                                                    </div>
                                                    <div className="col s3 m4 l4">
                                                        <input
                                                            type="text"
                                                            placeholder="Github URL "
                                                            name="githubusername"
                                                            defaultValue={social && social.githubusername}
                                                            onChange={e => onSocialChange(e)}
                                                        />
                                                        <small className="form-text grey-text">
                                                            If you want your latest repos and a Github link, include your
                                                            username
                                            </small>
                                                    </div>

                                                    <div className="col s2 m2 l2">
                                                        <i className="fab fa-facebook fa-2x right control-label white-text" />
                                                    </div>
                                                    <div className="col s3 m4 l4">
                                                        <input
                                                            type="text"
                                                            placeholder="Facebook URL"
                                                            name="facebook"
                                                            defaultValue={social && social.facebook}
                                                            onChange={e => onSocialChange(e)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row form-group social-input">
                                                    <div className="col s2 m2 l2">
                                                        <i className="fab fa-linkedin fa-2x right control-label white-text" />
                                                    </div>
                                                    <div className="col s3 m4 l4">
                                                        <input
                                                            type="text"
                                                            placeholder="Linkedin URL"
                                                            name="linkedin"
                                                            defaultValue={social && social.linkedin}
                                                            onChange={e => onSocialChange(e)}
                                                        />
                                                    </div>

                                                    <div className="col s2 m2 l2">
                                                        <i className="fab fa-twitter fa-2x right control-label white-text" />
                                                    </div>
                                                    <div className="col s3 m4 l4">
                                                        <input
                                                            type="text"
                                                            placeholder="Twitter URL"
                                                            name="twitter"
                                                            defaultValue={social && social.twitter}
                                                            onChange={e => onSocialChange(e)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row form-group social-input">
                                                    <div className="col s2 m2 l2">
                                                        <i className="fab fa-youtube fa-2x right control-label white-text" />
                                                    </div>
                                                    <div className="col s3 m4 l4">
                                                        <input
                                                            type="text"
                                                            placeholder="Youtube URL"
                                                            name="youtube"
                                                            defaultValue={social && social.youtube}
                                                            onChange={e => onSocialChange(e)}
                                                        />
                                                    </div>

                                                    <div className="col s2 m2 l2">
                                                        <i className="fab fa-instagram fa-2x right control-label white-text" />
                                                    </div>
                                                    <div className="col s3 m4 l4">
                                                        <input
                                                            type="text"
                                                            placeholder="Instagram"
                                                            name="instagram"
                                                            defaultValue={social && social.instagram}
                                                            onChange={e => onSocialChange(e)}
                                                        />
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Fragment>
                                )}
                                <br />
                                <br />
                                <div className="my-2">
                                    <button type="button" className="btn btn-success" onClick={() => handleEducationAdd()}>
                                        + Add Education Details
                                </button>
                                    <br />
                                    <span className="grey-text">Click on button to add multiple education information</span>
                                </div>

                                {educationFields.map((field, idx) => {

                                    return (

                                        <Fragment key={`${field}-${idx}`}>
                                            <button type="button" className="btn btn-danger" onClick={() => handleEducationRemove(idx)}>
                                                X
                                        </button>
                                            <Card style={{ border: "1px solid #fff" }}>
                                                <CardHeader color="warning" stats icon>
                                                    <CardIcon color="warning">
                                                        <h5>Education Information</h5>
                                                    </CardIcon>
                                                    <br />
                                                    <p className="cyan-text"> &nbsp;* = required field </p>
                                                </CardHeader>
                                                <CardBody>
                                                    <div className="row form-group">
                                                        <div className="col s4 m3 l2">
                                                            <label className="right control-label white-text"
                                                                style={{ fontSize: '15px' }} htmlFor="school">Institute/School: *
                                                </label>
                                                        </div>
                                                        <div className="col s8 m9 l10">
                                                            <input
                                                                type='text'
                                                                placeholder='School'
                                                                name='school'
                                                                value={field.school}
                                                                onChange={e => onEducationChange(idx, e)}
                                                                required
                                                            />
                                                            <small className="grey-text" >School Name, Campus, City</small>
                                                        </div>
                                                    </div>

                                                    <div className="row form-group">
                                                        <div className="col s3 m2 l2">
                                                            <label className="right control-label white-text"
                                                                style={{ fontSize: '15px' }} htmlFor="degree">Degree: *
                                                </label>
                                                        </div>
                                                        <div className="col s3 m4 l4">
                                                            <input
                                                                type="text"
                                                                className="form-control white-text "
                                                                placeholder="Degree"
                                                                name="degree"
                                                                value={field.degree}
                                                                onChange={e => onEducationChange(idx, e)}
                                                                required
                                                            />
                                                        </div>

                                                        <div className="row form-group">
                                                            <div className="col s3 m2 l2">
                                                                <label className="right control-label white-text"
                                                                    style={{ fontSize: '15px' }} htmlFor="JobLocation">Field of Study: *
                                                                </label>
                                                            </div>
                                                            <div className="col s3 m4 l4">
                                                                <input
                                                                    type="text"
                                                                    className="form-control white-text "
                                                                    name="fieldofstudy"
                                                                    placeholder="Field of Study"
                                                                    value={field.fieldofstudy}
                                                                    onChange={e => onEducationChange(idx, e)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-group">
                                                        <div className="col s2 m2 l2">
                                                            <label className="right control-label white-text"
                                                                style={{ fontSize: '15px' }} htmlFor="educationfrom">From: *
                                                            </label>
                                                        </div>
                                                        <div className="col s3 m3 l3">
                                                            <input
                                                                type="date"
                                                                className="form-control white-text "
                                                                placeholder="From"
                                                                name="educationfrom"
                                                                // value={field.educationfrom}
                                                                defaultValue={field.educationfrom ? moment(new Date(field.educationfrom)).format('YYYY-MM-DD') : ""}

                                                                onChange={e => onEducationChange(idx, e)}
                                                                required
                                                            />
                                                        </div>

                                                        <div className="row form-group">
                                                            <div className="col s1 m1 l1">
                                                                <label className="right control-label white-text"
                                                                    style={{ fontSize: '15px' }} htmlFor="educationTo">To:
                                                                </label>
                                                            </div>
                                                            <div className="col s3 m3 l3">
                                                                <input
                                                                    type="date"
                                                                    className="form-control white-text "
                                                                    name="educationto"
                                                                    placeholder="To"
                                                                    // value={field.educationto}
                                                                    defaultValue={field.educationto ? moment(new Date(field.educationto)).format('YYYY-MM-DD') : ""}
                                                                    onChange={e => onEducationChange(idx, e)}

                                                                />
                                                            </div>
                                                            <div className="col s1 m1 l1">
                                                                <input
                                                                    type="checkbox"
                                                                    style={{ opacity: 1, pointerEvents: "auto", position: "relative" }}
                                                                    className="form-control white-text "
                                                                    name="educationcurrent"
                                                                    checked={field.educationcurrent}
                                                                    defaultValue={field.educationcurrent}
                                                                    onChange={e => onEducationChange(idx, e)}
                                                                />
                                                            </div>
                                                            <div className="col s1 m1 l1">
                                                                <label className="right control-label white-text"
                                                                    style={{ fontSize: '15px' }} htmlFor="educationcurrent">Current:
                                                                </label>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="row form-group">
                                                        <div className="col s3 m2 l2">
                                                            <label className="right control-label white-text"
                                                                style={{ fontSize: '15px' }} htmlFor="educationdescription">Description:
                    </label>
                                                        </div>
                                                        <div className="col s9 m10 l10">
                                                            <textarea
                                                                type="text"
                                                                className="form-control white-text "
                                                                name="educationdescription"
                                                                placeholder="A short description of your school such as achievements, activities"
                                                                value={field.educationdescription}
                                                                onChange={e => onEducationChange(idx, e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Fragment>
                                    );
                                }

                                )}

                                <br />
                                <br />
                                <div className="my-2">
                                    <button type="button" className="btn btn-success" onClick={() => handleExperienceAdd()}>
                                        + Add Experience Details
                             </button>
                                    <br />
                                    <span className="grey-text">Click on button to add multiple experience information</span>
                                </div>
                                {experienceFields.map((field, idx) => {
                                    return (<Fragment key={`${field}--${idx}`}>
                                        <button type="button" className="btn btn-danger" onClick={() => handleExperienceRemove(idx)}>
                                            X
                                      </button>
                                        <Card style={{ border: "1px solid #fff", padding: "20px" }}>
                                            <CardHeader color="rose" stats icon>
                                                <CardIcon color="rose">
                                                    <h5>Experience Information</h5>
                                                </CardIcon>
                                                <br />
                                                <p className="cyan-text"> &nbsp;* = required field </p>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="row form-group">
                                                    <div className="col s4 m3 l2">
                                                        <label className="right control-label white-text"
                                                            style={{ fontSize: '15px' }} htmlFor="JobTitle">Job Title: *
                                            </label>
                                                    </div>
                                                    <div className="col s8 m9 l10">
                                                        <input
                                                            type='text'
                                                            placeholder='Job Title'
                                                            name='jobtitle'
                                                            defaultValue={field.jobtitle}
                                                            onChange={e => onExperienceChange(idx, e)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row form-group">
                                                    <div className="col s3 m2 l2">
                                                        <label className="right control-label white-text"
                                                            style={{ fontSize: '15px' }} htmlFor="JobCompany">Company: *
                                    </label>
                                                    </div>
                                                    <div className="col s3 m4 l4">
                                                        <input
                                                            type="text"
                                                            className="form-control white-text "
                                                            placeholder="Company"
                                                            name="jobcompany"
                                                            defaultValue={field.jobcompany}
                                                            onChange={e => onExperienceChange(idx, e)}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="row form-group">
                                                        <div className="col s3 m2 l2">
                                                            <label className="right control-label white-text"
                                                                style={{ fontSize: '15px' }} htmlFor="JobLocation">Location: *
                                        </label>
                                                        </div>
                                                        <div className="col s3 m4 l4">
                                                            <input
                                                                type="text"
                                                                className="form-control white-text "
                                                                name="joblocation"
                                                                placeholder="Location"
                                                                defaultValue={field.joblocation}
                                                                onChange={e => onExperienceChange(idx, e)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row form-group">
                                                    <div className="col s2 m2 l2">
                                                        <label className="right control-label white-text"
                                                            style={{ fontSize: '15px' }} htmlFor="JobFrom">From: *
                                    </label>
                                                    </div>
                                                    <div className="col s3 m3 l3">
                                                        <input
                                                            type="date"
                                                            className="form-control white-text "
                                                            placeholder="From"
                                                            name="jobfrom"
                                                            defaultValue={field.jobfrom ? moment(new Date(field.jobfrom)).format('YYYY-MM-DD') : ""}
                                                            onChange={e => onExperienceChange(idx, e)}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="row form-group">
                                                        <div className="col s1 m1 l1">
                                                            <label className="right control-label white-text"
                                                                style={{ fontSize: '15px' }} htmlFor="JobTo">To:
                                        </label>
                                                        </div>
                                                        <div className="col s3 m3 l3">
                                                            <input
                                                                type="date"
                                                                className="form-control white-text "
                                                                name="jobto"
                                                                placeholder="To"
                                                                defaultValue={field.jobto ? moment(new Date(field.jobto)).format('YYYY-MM-DD') : ""}
                                                                onChange={e => onExperienceChange(idx, e)}

                                                            />
                                                        </div>
                                                        <div className="col s1 m1 l1">
                                                            <input
                                                                type="checkbox"
                                                                style={{ opacity: 1, pointerEvents: "auto", position: "relative" }}
                                                                className="form-control white-text "
                                                                name="jobcurrent"
                                                                checked={field.jobcurrent}
                                                                defaultValue={field.jobcurrent}
                                                                onChange={e => onExperienceChange(idx, e)}
                                                            />
                                                        </div>
                                                        <div className="col s1 m1 l1">
                                                            <label className="right control-label white-text"
                                                                style={{ fontSize: '15px' }} htmlFor="jobcurrent">Current:
                                        </label>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="row form-group">
                                                    <div className="col s3 m2 l2">
                                                        <label className="right control-label white-text"
                                                            style={{ fontSize: '15px' }} htmlFor="jobdescription">Description:
                                    </label>
                                                    </div>
                                                    <div className="col s9 m10 l10">
                                                        <textarea
                                                            type="text"
                                                            className="form-control white-text "
                                                            name="jobdescription"
                                                            placeholder="A short description of your job"
                                                            defaultValue={field.jobdescription}
                                                            onChange={e => onExperienceChange(idx, e)}
                                                        />
                                                        <small className="form-text grey-text">Tell us a little about your job responsibities and other details</small>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Fragment>);
                                })}

                                <br /> <br />
                                <button className="right btn btn-primary my-2" >Submit </button>
                                {role && role === "manager" ?
                                                        <a href="/managerprofile" className="small btn btn-primary"> Go Back</a>
                                                        : <a href="/candprofile" className="btn btn-primary">Go Back </a>
                                                    }
                                {/* <a className="btn btn-danger my-1" href="/candprofile">
                                    Go Back
                            </a> */}

                                <Alert />
                            </form>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
};

EditCreateProfile.propTypes = {
    createorupdateProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps, { createorupdateProfile, getCurrentProfile, setPage })(withRouter(EditCreateProfile));