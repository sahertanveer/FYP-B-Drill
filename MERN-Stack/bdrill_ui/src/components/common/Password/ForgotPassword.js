import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { forgotPassword } from '../../../actions/passwordAuthAction'
import Alert from '../../../layout/Alert'

const ForgotPassword = ({ forgotPassword }) => {
    const [formData, setFormData] = useState({
        email: '',
    });

      
    const { email} = formData;
        
    const onChange = e => 
        setFormData({...formData, [e.target.name]: e.target.value });
        
    const onSubmit = async e => {
        e.preventDefault()
        forgotPassword({ email });
    }
      
        return (
            <BrowserRouter>
            <div className="container uicards center" style={{marginTop:'10%'}}>
                <div className="row">
                    <div className="col s12 m8 l8 offset-m2 offset-l2">
                        <br/>
                        <i class="fas fa-lock fa-3x" />
                        <h3 className="card-stats-number center" style={{ fontFamily: "Princess Sofia" }}> Forgot your Password?</h3>
                        <hr />
                        <Alert />
                        <br />
                        <form onSubmit={onSubmit} className="  center container ">

                            <small className="  center ">
                                Don't worry, Resetting your password is easy. Just type in the email you registered to B-Drill.
                            </small>
                            
                            <div className="form-group">
                                <div className="row">
                                    <div className="col s12 m3 l2">
                                        <h6 htmlFor="email">Email:</h6>
                                    </div>
                                    <div className="col s12 m9 l10">
                                        <input
                                            type="email"
                                            className="form-control   "
                                            name="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={e => onChange(e)}
                                            required
                                        />
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

                            <small>Did you remember your Password? &nbsp;
                                <a href="/home">Try Logging In</a>
                            </small>
                            <br/>
                            <br/>
                        </form>
                    </div>
                </div>

            </div>

        </BrowserRouter>
        )
    }

ForgotPassword.propTypes = {
    forgotPassword:PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    auth: state.auth,
})
    
export default connect( mapStateToProps, { forgotPassword })(ForgotPassword)