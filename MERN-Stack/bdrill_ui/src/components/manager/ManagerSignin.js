import React, { useState } from 'react'
import { BrowserRouter, Redirect } from 'react-router-dom'
import Particles from 'react-particles-js'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/managerAuthAction'
import Alert from '../../layout/Alert'


const ManagerSignin = ({ login, isAuthenticated, role }) => {
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
  if (isAuthenticated && role === "manager") {
    return <Redirect to='/managerdashboard' />
  }

  return (
    <BrowserRouter>
      <div className="container-fluid">
        <div className="particles"
          style={{
            zIndex: 9996, position: 'fixed', opacity: '1',
          }}>

          <Particles
            params={{

              "particles": {
                "number": {
                  "value": 160
                },
                "color": {
                  "value": "#80BD9E"
                },
                "shape": {
                  "type": "circle",
                  "stroke": {
                    "width": 1,
                    "color": "#ccc"
                  }
                },
                "opacity": {
                  "value": 0.2,
                  "random": true,
                  "anim": {
                    "enable": false,
                    "speed": 1
                  }
                },
                "size": {
                  "value": 2,
                  "random": false,
                  "anim": {
                    "enable": false,
                    "speed": 30
                  }
                },
                "move": {
                  "direction": "none",
                  "out_mode": "out",
                  "enable": true,
                  "speed": 7,
                  "straight": false
                },
                "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#07575B",
                  "width": 1
                },
              },
              "interactivity": {
                "events": {
                  "onhover": {
                    "enable": true,
                    "mode": "repulse"
                  },
                  "onclick": {
                    "enable": true,
                    "mode": "push"
                  }
                },
                "modes": {
                  "repulse": {
                    "distance": 50,
                    "duration": 0.4
                  },
                  "bubble": {
                    "distance": 150,
                    "opacity": 20,
                    "size": 10
                  }
                }
              }

            }}
          />
        </div>
        <center>
          <div className="signin center" style={{ zIndex: 9999, position: 'relative', opacity: '1', marginTop: '10%' }}>
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
              </div>
            </form>
          </div>
        </center>
      </div>
    </BrowserRouter>
  )
}

ManagerSignin.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  role: PropTypes.string
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  role: state.auth.role
})

export default connect(mapStateToProps, { login })(ManagerSignin)
