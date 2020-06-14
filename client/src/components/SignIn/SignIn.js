import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import constants from '../config/constants'
import { setAuthData, getFormConfig } from '../../store/actions'

import './SignIn.css'
import logo from '../../assets/images/ttn-logo-transparent.png'

const SignIn = ({
    history,
    isAuthenticated,
    setAuthData,
    getFormConfig }) => {

    useEffect(
        () => {
            if (window.location.search) {
                setAuthData()
                getFormConfig()
            } else if (isAuthenticated || window.localStorage.getItem('token')) {
                history.push('/buzz')
            }
        },
        [isAuthenticated, setAuthData, getFormConfig, history]
    )

    return (

        isAuthenticated
            ? <Redirect to="/buzz" />
            : <div className="SignIn flex-container">
                <div className="backdrop"></div>
                <div className="SignInContent flex-container">
                    <img src={logo} alt="TTN-Logo" />
                    <p>Create Your Own Buzz</p>
                    <form
                        className="SignInGoogle"
                        action={constants.SERVER_URL + '/auth/google'}
                        method="GET">
                        <button type="submit">
                            <i className="fab fa-google"></i>
                        &nbsp;&nbsp;Sign in with gmail
                    </button>
                    </form>
                </div>
            </div>

    )
}

const mapDispatchToProps = {
    setAuthData,
    getFormConfig
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authData.token || false
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)