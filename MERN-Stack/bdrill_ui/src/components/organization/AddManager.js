import React, { useState } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { registerManager } from '../../actions/organizationAuthAction'
import { setAlert } from '../../actions/alertAction'
import Alert from '../../layout/Alert'


const AddManager = ({ setAlert, registerManager, managerRegistered, auth: { _id } }) => {
    const [formData, setFormData] = useState({
        organization_id: _id,
        firstname: '',
        lastname: '',
        email: '',
        // password: '',
        // password2: ''
    });


    const { organization_id, firstname, middlename, lastname, email, avatar, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault()
        registerManager({ organization_id, firstname, middlename, lastname, email, avatar, password });
        // return <Redirect to='/userslist' />
        setAlert('User Added Successfully', 'primary')
    }

    //Redirect if registered 
    // if (managerRegistered) {
    //     return <Redirect to='/userslist' />
    // }
    return (

        <BrowserRouter>
                <div className="container-fluid">
                    <form className="signup_form" onSubmit={e => onSubmit(e)} style={{ opacity: 1 }}>
                        <div className="card-content  insert " >
                            <h1 className="h3 mb-3 font-weight-normal bold-text white-text">Add Manager</h1>
                            <hr />
                            <Alert />
                            <br />
                            <div className="form-group center">
                                <i className="small material-icons">
                                    person <input
                                        type="text"
                                        className="form-control"
                                        name="firstname"
                                        placeholder="First Name *"
                                        value={firstname}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </i>
                            </div>

                            <div className="form-group center">
                                <i className="small material-icons">
                                    person <input
                                        type="text"
                                        className="form-control"
                                        name="lastname"
                                        placeholder="Last Name *"
                                        value={lastname}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </i>
                            </div>

                            <div className="form-group center">
                                <i className="small material-icons">
                                    email <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email Address *"
                                        value={email}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </i>
                                <br />
                                <small className="form-text">
                                    This site uses Gravatar, so if you want a profile image, use a Gravatar email
                                    </small>
                            </div>
                            <br />
                            <center>
                                <button
                                    type="submit"
                                    className="btn success center"
                                    style={{ opacity: '0.9' }}
                                >
                                    Add
                                </button>
                            </center>
                        </div>
                    </form>
                </div>

        </BrowserRouter>
    )
}

AddManager.propTypes = {
    registerManager: PropTypes.func.isRequired,
    managerRegistered: PropTypes.bool,
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    managerRegistered: state.user.managerResitered,
    auth: state.auth,
    alert: state.alert
})

export default connect(mapStateToProps, { registerManager, setAlert })(AddManager)