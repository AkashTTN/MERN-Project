import React from 'react'

import { connect } from "react-redux";

import SignIn from "../SignIn/SignIn";

const withAuth = (WrappedComponent) => {
    return (props) => {
        return (
            props.isAuthenticated
                ? <WrappedComponent {...props} />
                : <SignIn />
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authData.token || false
    }
}

export default connect(mapStateToProps)(withAuth)