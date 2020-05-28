import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'

//Candidate Panel
import CandSignin from '../candidate/CandSignin'

const styleObj = {
    marginTop: "20%"
}


const CandidatePrivateRoute = ({ component: Component, auth: { isAuthenticated, loading, role, token }, ...rest }) => (


    <Route {...rest} render={props =>
        loading ? <center><div style={styleObj}> <Loader color="#00BFFF" height={100} width={100} timeout={0} /> </div></center> : //type="None"
            (
                (token && isAuthenticated && role === "candidate") ? (<Component {...props} />) : (<CandSignin />)
            )
    }

    />
)

CandidatePrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(CandidatePrivateRoute)

