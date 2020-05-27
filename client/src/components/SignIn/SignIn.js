import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import constants from '../config/constants'
import { setAuthData } from '../../store/actions'

import './SignIn.css'
import logo from '../../assets/images/ttn-logo.png'

const SignIn = ({ history, isAuthenticated, setAuthData }) => {

    useEffect(
        () => {
            if (window.location.search) {
                setAuthData()
            } else if (isAuthenticated || window.localStorage.getItem('token')) {
                history.push('/buzz')
            }
        },
        [isAuthenticated, setAuthData, history]
    )

    // const onSubmitHandler = useCallback(
    //     () => {

    //         const options = {
    //             redirect: 'manual'
    //         }

    //         fetch(constants.SERVER_URL + '/auth/google', options)
    //             // .then(res => res.json())
    //             .then(data => {
    //                 console.log('Response Object', data)
    //                 console.log('Token', data.token)

    //             })
    //     },
    //     []
    // )

    return (

        isAuthenticated
            ? <Redirect to="/buzz" />
            : <div className="SignIn flex-container">
                <div className="SignInContent flex-container">
                    <img src={logo} alt="TTN-Logo" />
                    <p>Creat Your Own Buzz</p>
                    <form className="SignInGoogle" action={constants.SERVER_URL + '/auth/google'} method="GET">
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
    setAuthData
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authData.token || false
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)