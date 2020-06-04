import React, { useState, useEffect } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Particles from '../common/Particles'
import { registerOrganization } from '../../actions/organizationAuthAction'
import Alert from '../../layout/Alert'
import OrgSignin from './OrgSignin'

const OrgRegistration = ({ registerOrganization, isAuthenticated, role }) => {

    const initialState = ({
        username: '',
        designation: '',
        organizationname: '',
        address: '',
        website: '',
        countrycode: '',
        phone: '',
        faxnumber: '',
        email: '',
        password: '',
        avatar: '',
        year: '',
    });
    const [formData, setFormData] = useState(initialState);
    useEffect(() => {
        if (!registerOrganization) {
            const RegistrationData = { ...initialState };
            for (const key in registerOrganization) {


                if (key === "contact") { //profileData has no contact as a key
                    let contactArray = registerOrganization.contact.split('-');
                    RegistrationData.countrycode = contactArray[0]
                    RegistrationData.phone = contactArray[1]
                }
                if (key in RegistrationData) RegistrationData[key] = registerOrganization[key];
            }
            setFormData(RegistrationData);
        }
    }, [isAuthenticated]);

    const { username, designation, organizationname, address, website, countrycode, phone, faxnumber, avatar, email, password, year } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async e => {
        e.preventDefault()

        registerOrganization({
            username, designation, organizationname, address, website, countrycode, phone, faxnumber, avatar, email, password, year
        });
    };

    // Redirect if logged  in 
    if (isAuthenticated) {
        return <Redirect to='/orgsignin' />
        
    }

    return (
        <BrowserRouter>
        <Route exact path="/orgsignin" component={OrgSignin} />

            <div className="container-fluid">
                <div className="particles" style={{ zIndex: 9996, position: 'fixed', opacity: '1' }}>
                    <Particles />
                </div>
                <center>
                    <div className="signin center" style={{ zIndex: 9999, position: 'relative', opacity: '1', marginTop: '8%' }}>
                        <form className="signup_form" onSubmit={e => onSubmit(e)} style={{ opacity: 1 }}>
                            <div className="card-content white-text insert " >
                                <h1 className="h3 mb-3 font-weight-normal bold-text white-text">Sign Up</h1>
                                <Alert />
                                <div className="form-group" style={{ opacity: '1' }}>
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <label htmlFor="username"><i className="fas fa-user fa-2x "></i></label>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="text"
                                                id="username"
                                                className="form-control white-text "
                                                name="username"
                                                placeholder="User Name *"
                                                value={username}
                                                onChange={e => onChange(e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ opacity: '1' }}>
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <label htmlFor="designation"><i className="fas fa-certificate fa-2x "></i></label>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="text"
                                                id="designation"
                                                className="form-control white-text "
                                                name="designation"
                                                placeholder="Designation * "
                                                value={designation }
                                                onChange={e => onChange(e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ opacity: '1' }}>
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <label htmlFor="organizationname"><i className="fas fa-building fa-2x "></i></label>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="text"
                                                id="organizationname"
                                                className="form-control white-text "
                                                name="organizationname"
                                                placeholder="Organization Name *"
                                                value={organizationname}
                                                onChange={e => onChange(e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ opacity: '1' }}>
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <label htmlFor="email"><i className="fas fa-envelope fa-2x "></i></label>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="email"
                                                id="email"
                                                className="form-control white-text "
                                                name="email"
                                                placeholder="Email Address  *"
                                                value={email}
                                                onChange={e => onChange(e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ opacity: '1' }}>
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <label htmlFor="contact"><i className="fas fa-phone fa-2x "></i></label>
                                        </div>
                                        <div className="col s4 m2 l2">
                                            <input
                                                type="number"
                                                className="form-control white-text "
                                                name="countrycode"
                                                placeholder="00  *"
                                                defaultValue={countrycode}
                                                onChange={e => onChange(e)}
                                                required
                                            />
                                        </div>
                                        <div className="col s8 m6 l7">
                                            <input
                                                type="text"
                                                className="form-control white-text "
                                                name="phone"
                                                placeholder="Phone No  *"
                                                defaultValue={phone}
                                                onChange={e => onChange(e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ opacity: '1' }}>
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <label htmlFor="website"><i className="fas fa-globe fa-2x "></i></label>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="text"
                                                id="website"
                                                className="form-control white-text "
                                                name="website"
                                                placeholder="Website "
                                                value={website}
                                                onChange={e => onChange(e)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ opacity: '1' }}>
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <label htmlFor="faxnumber"><i className="fas fa-fax fa-2x "></i></label>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="text"
                                                id="faxnumber"
                                                className="form-control white-text "
                                                name="faxnumber"
                                                placeholder="Fax Number "
                                                value={faxnumber}
                                                onChange={e => onChange(e)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ opacity: '1' }}>
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <label htmlFor="address"><i className="fas fa-map-marker fa-2x "></i></label>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="text"
                                                id="address"
                                                className="form-control white-text "
                                                name="address"
                                                placeholder="Address  *"
                                                value={address}
                                                onChange={e => onChange(e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ opacity: '1' }}>
                                    <div className="row">
                                        <div className="col s12 m4 l3">
                                            <label htmlFor="year"><i className="fas fa-fax fa-2x "></i></label>
                                        </div>
                                        <div className="col s12 m8 l9">
                                            <input
                                                type="text"
                                                id="year"
                                                className="form-control white-text "
                                                name="year"
                                                placeholder="Established Year  *"
                                                value={year}
                                                onChange={e => onChange(e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-lg btn-primary"
                                    style={{ opacity: '0.9' }}
                                >
                                    Signup
                                </button>
                                <br />
                                <br />
                                <div className="center">
                                    <p>
                                        Already have an Account?
                                         &nbsp;<a href="/orgsignin"> SIGN IN</a>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </center>
            </div>
        </BrowserRouter>
    )
}

OrgRegistration.propTypes = {
    registerOrganization: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    role: PropTypes.string
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    role: state.auth.role
})

export default connect(mapStateToProps, { registerOrganization })(OrgRegistration)
