import React, { useCallback } from 'react'

import constants from '../config/constants'

import './SignIn.css'
import logo from '../../assets/images/ttn-logo.png'

const SignIn = () => {

    const onSubmitHandler = useCallback(
        () => {

            const options = {
                redirect: 'manual'
            }

            fetch(constants.SERVER_URL + '/auth/google', options)
                // .then(res => res.json())
                .then(data => {
                    console.log('Response Object', data)
                    console.log('Token', data.token)

                })
        },
        []
    )

    return (
        <div className="SignIn flex-container">
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

export default SignIn