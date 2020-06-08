import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'

//Admin Panel
import AdminSignin from '../admin/AdminSignin'

const styleObj = {
    marginTop: "20%"
}

const AdminPrivateRoute = ({ component: Component, auth: { isAuthenticated, loading, role,token }, ...rest }) => (

    <Route {...rest} render={props =>
        loading ? <center><div style={styleObj}> <Loader color="#00BFFF" height={100} width={100} timeout={0} /> </div></center> : //type="None"

            (
                (token &&isAuthenticated && role === "admin") ? (<Component {...props} />) : (<AdminSignin />)
            )
    }
    />

)

AdminPrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}


const mapStateToProps = state => ({
    auth: state.auth
});


export default connect(mapStateToProps)(AdminPrivateRoute)

