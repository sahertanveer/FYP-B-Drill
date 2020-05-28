import React, { useState } from 'react'
import { BrowserRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PasswordStrengthBar from 'react-password-strength-bar';
import { changePassword } from '../../../actions/passwordAuthAction'
import { setAlert } from '../../../actions/alertAction'
import Alert from '../../../layout/Alert'

const ChangePassword = ({ setAlert , changePassword, auth:{_id} }) => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        _id: _id,
        password: '',
        newpassword: '',
        confirmpassword: ''
    });

    const { password, newpassword, confirmpassword } = formData;
        
    const onChange = e => 
        setFormData({...formData, [e.target.name]: e.target.value });
        
    const onSubmit = async e => {
        e.preventDefault()
        if(newpassword !== confirmpassword){
        setAlert(' Password do not match', 'danger')
    }
      
    else{
        changePassword({ _id, password, newpassword });
        }
    }
      
        return (
            <BrowserRouter>
            <div className="container uicards center" style={{marginTop:'4%'}}>
                <div className="row">
                    <div className="col s12 m8 l8 offset-m2 offset-l2">
                        <br/>
                        <i className="fas fa-unlock fa-3x" />
                        <h3 className="card-stats-number center" style={{ fontFamily: "Princess Sofia" }}> Change Password</h3>
                        <hr />
                        <Alert />
                        <br />
                        <form onSubmit={onSubmit} className="  center container ">

                            <small className="  center ">
                                Change password to keep your account secure.
                            </small>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col s12 m4 l3">
                                        <h6 htmlFor="password">Old Password:</h6>
                                    </div>
                                    <div className="col s10 m7 l8">
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            className="form-control   "
                                            name="password"
                                            placeholder="Old Password"
                                            value={password}
                                            onChange={e => onChange(e)}
                                            required
                                        />
                                    </div>
                                    <div className="col s2 m1 l1">
                                        <button onClick={() => setShowOldPassword(!showOldPassword)}>
                                            <i className="fas fa-eye" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="row">
                                    <div className="col s12 m4 l3">
                                        <h6 htmlFor="newpassword">New Password:</h6>
                                    </div>
                                    <div className="col s10 m7 l8">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            className="form-control   "
                                            name="newpassword"
                                            placeholder="New Password"
                                            value={newpassword}
                                            onChange={e => onChange(e)}
                                            required
                                        />
                                        <PasswordStrengthBar password={newpassword} />
                                    </div>
                                    <div className="col s2 m1 l1">
                                        <button onClick={() => setShowNewPassword(!showNewPassword)}>
                                            <i className="fas fa-eye" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col s12 m4 l3">
                                        <h6 htmlFor="confirmpassword">Confirm Password:</h6>
                                    </div>
                                    <div className="col s10 m7 l8">
                                        <input
                                         type={showConfirmPassword ? "text" : "password"}
                                            className="form-control"
                                            name="confirmpassword"
                                            placeholder="Retype to Confirm Password"
                                            value={confirmpassword}
                                            onChange={e => onChange(e)}
                                            required
                                        />
                                    </div>
                                    <div className="col s2 m1 l1">
                                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <i className="fas fa-eye" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn success"
                                style={{ opacity: '0.9' }}
                            >
                                Reset Password
                            </button>
                            <br/>
                            <br/>
                        </form>
                    </div>
                </div>

            </div>

        </BrowserRouter>
        )
    }

ChangePassword.propTypes = {
    changePassword:PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
    auth: state.auth,
    alert: state.alert
})
    
export default connect( mapStateToProps, { changePassword, setAlert })(ChangePassword)