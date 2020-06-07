import React, { useState } from 'react'
import { BrowserRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Particles from '../common/Particles'
import { login } from '../../actions/organizationAuthAction'
import Alert from '../../layout/Alert'

const OrgSignin = ({ login, isAuthenticated, role }) => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async e => {
        e.preventDefault()

        login({ email, password });
    };

    //Redirect if logged  in 
    if (isAuthenticated && role === "organization") {
        return (<Redirect to='/orgdashboard' />)
    }

    return (
        <BrowserRouter>
            {/* <Route path="/orgregistration" component={OrgRegistration} /> */}

            <div className="container-fluid">
                <div className="particles" style={{ zIndex: 9996, position: 'fixed', opacity: '1' }}>
                    <Particles />
                </div>
                <center >
                    <div className="signin center" style={{ zIndex: 9999, position: 'relative', opacity: '1', marginTop: '8%' }}>
                        <form className="signin_form" onSubmit={e => onSubmit(e)} style={{ opacity: 1 }}>
                            <div className="card-content white-text insert " >
                                <h1 className="h3 mb-3 font-weight-normal bold-text white-text">Sign In</h1>
                                <Alert />
                                <div className="form-group" style={{ opacity: '1' }}>
                                    <label htmlFor="email">EMAIL ADDRESS</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control white-text "
                                        name="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ opacity: '1' }}>
                                    <label htmlFor="password">PASSWORD </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control white-text "
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </div>
                                <div className="form-group left">
                                    <input type="checkbox" name="remember" id="remember" style={{ opacity: 1 }} />
                                    &nbsp; &nbsp; <label htmlFor="remember">Remember me </label>
                                </div>
                                <div className="p-container">
                                    <a href="/forgotpassword" className="right"> Forgot Password?</a>
                                </div>
                                <br />
                                <br />
                                <button
                                    type="submit"
                                    className="btn btn-lg btn-primary"
                                    style={{ opacity: '0.9' }}
                                >
                                    Login
                                </button>
                                <br />
                                <br />
                                <div className="center">Dont have Account?
                                    <a href="/orgregistration"> SIGN UP</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </center>
            </div>
        </BrowserRouter>
    )
}

OrgSignin.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    role: PropTypes.string
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    role: state.auth.role
})

export default connect(mapStateToProps, { login })(OrgSignin)
