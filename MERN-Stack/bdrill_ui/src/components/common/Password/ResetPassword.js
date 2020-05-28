import React, { useState } from 'react'
import { BackendInstance } from '../../../config/axiosInstance';
import { BrowserRouter, Redirect, withRouter, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import PasswordStrengthBar from 'react-password-strength-bar';
import { resetPassword } from '../../../actions/passwordAuthAction'
import { setAlert } from '../../../actions/alertAction'
import Alert from '../../../layout/Alert'
import { setPage } from '../../../actions/pageAction';

const ResetPassword = ({ setAlert , resetPassword, setPage }) => {
    const values = queryString.parse(window.location.search)
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmpassword: '',
        token: values.token,
        render: false,
        request:true
    });
    const hist = useHistory()
        const config = {
          headers: {
            'Content-Type': ' application/json',
            'x-auth-token': values.token 
          }
        }
        if(formData.request)
        try {
           BackendInstance.get('/api/password/authtoken', config )
           .then((res) =>{
           setFormData({...formData, render: true, request:false})
           console.log(formData)
        }
           )
           .catch( (err) =>{
               console.log(err.response.data.msg)
            // return <Redirect to = '/home' />
            hist.push(`/home`)
            setPage("home")
            }
           )
          
        } catch (err) {
          console.log(err)
        }

    console.log(values.token)
 
    const {  password, confirmpassword, token } = formData;
        
    const onChange = e => 
        setFormData({...formData, [e.target.name]: e.target.value });
        
    const onSubmit = async e => {
        e.preventDefault()
        if(password !== confirmpassword){
        setAlert(' Password do not match', 'danger')
    }
      
    else{
        resetPassword({  password, token });
        }
    }
      if(formData.render)
        return (
            <BrowserRouter>
            <div className="container uicards center" style={{marginTop:'7%'}}>
                <div className="row">
                    <div className="col s12 m8 l8 offset-m2 offset-l2">
                        <br/>
                        <i className="fas fa-unlock fa-3x" />
                        <h3 className="card-stats-number center" style={{ fontFamily: "Princess Sofia" }}> Reset your Password</h3>
                        <hr />
                        <Alert />
                        <br />
                        <form onSubmit={onSubmit} className="  center container ">

                            <small className="  center ">
                                Reset your password to get your account.
                            </small>
                            
                            <div className="form-group">
                                <div className="row">
                                    <div className="col s12 m4 l3">
                                        <h6 htmlFor="password">New Password:</h6>
                                    </div>
                                    <div className="col s10 m7 l8">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            className="form-control"
                                            name="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={e => onChange(e)}
                                            required
                                        />
                                        <PasswordStrengthBar password={password} />
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

                            <small>Let's go back to &nbsp;
                                <a href="/home">Home</a>
                            </small>
                            <br/>
                            <br/>
                        </form>
                    </div>
                </div>

            </div>

        </BrowserRouter>
        )
        else return null;
    }

ResetPassword.propTypes = {
    resetPassword:PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
    auth: state.auth,
    alert: state.alert
})
    
export default withRouter(connect( mapStateToProps, { resetPassword, setAlert, setPage })(ResetPassword))