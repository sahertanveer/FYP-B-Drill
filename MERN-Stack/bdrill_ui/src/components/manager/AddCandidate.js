import React, { useState } from 'react'
import { BrowserRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { registerCandidate } from '../../actions/managerAuthAction'
import { setAlert } from '../../actions/alertAction'
import Alert from '../../layout/Alert'

const AddCandidate = ({ setAlert, registerCandidate, candidateRegistered, auth: { _id, organization_id } }) => {
    const [formData, setFormData] = useState({
        manager_id: _id,
        organization_id: organization_id,
        firstname: '',
        lastname: '',
        email: '',
        // password: '',
        // password2: ''
    });


    const { manager_id, firstname, lastname, email } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault()
        registerCandidate({ organization_id, manager_id, firstname, lastname, email });
        setAlert('User Added Successfully', 'primary')

        // if(password !== password2){
        //     setAlert(' Password do not match', 'danger')
        // }

        // else{
        //     registerCandidate({ manager_id, firstname, lastname, email, password });
        //     }
    }

    //Redirect if registered 
    if (candidateRegistered)
        return <Redirect to='/candidatelist' />

    return (
        <BrowserRouter>
            <div className="container-fluid">

                <form className="signup_form" onSubmit={e => onSubmit(e)} style={{ opacity: 1, marginTop:'50px' }}>
                    <div className="card-content " >
                        <h1 className="h3 mb-3 font-weight-normal bold-text white-text">Add Candidate</h1>
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
                        <br />
                    </div>
                </form>

            </div>

        </BrowserRouter>
    )
}

AddCandidate.propTypes = {
    registerCandidate: PropTypes.func.isRequired,
    candRegistered: PropTypes.bool,
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
    candRegistered: state.user.candidateRegistered,
    auth: state.auth,
    alert: state.alert
})

export default connect(mapStateToProps, { registerCandidate, setAlert })(AddCandidate)