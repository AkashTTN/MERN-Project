import React, { useCallback, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

import { removeAuthData, setAuthData } from '../../store/actions'

import NavList from '../NavList/NavList';
import Form from "../UI/Form/Form";
import Posts from "../Posts/Posts";
import ComplaintsList from '../UI/ComplaintsList/ComplaintsList'

import './Feed.css'
import logo from '../../assets/images/ttn-logo.png'

const Feed = React.memo(({ removeAuthData, setAuthData, mode, user, authError, isAuthenticated }) => {

    const [redirect, setRedirect] = useState(false)

    let feed = null
    let feedBodyContent = null

    switch (mode) {
        case 'buzz':
            feedBodyContent = (
                <>
                    <Form formType="Buzz" />
                    <Posts />
                </>
            )
            break

        case 'complaints':
            feedBodyContent = (
                <>
                    <Form formType="Complaint" />
                    <ComplaintsList />
                </>
            )
    }

    // with redux
    useEffect(
        () => {
            if (authError || !isAuthenticated) {
                if (window.localStorage.getItem('token')) {
                    setAuthData()
                } else {
                    setRedirect(true)
                }
            }
        },
        [setRedirect, authError, isAuthenticated, setAuthData]
    )

    const logoutHandler = useCallback(
        () => {

            // Remove token from storage and clear auth data from store
            removeAuthData()

            // Redirect to sign in page
            setRedirect(true)

        },
        [setRedirect, removeAuthData]
    )

    if (user) {
        feed = (
            <>
                <div className="FeedHeader">
                    <div className="Logout flex-container">
                        <button className="LogoutButton" onClick={logoutHandler}>Logout</button>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                    <div className="FeedHeaderImage flex-container">
                        {
                            mode === 'buzz' 
                            ? <p>POSTING YOUR THOUGHTS</p>
                            : <p>CREATING BUZZ AROUND YOU</p>
                        }
                        <p>NEVER BEEN SO EASY..</p>
                    </div>
                    <img className="FeedHeaderLogo" src={logo} alt="TTN-Logo" />
                </div>
                <div className="FeedBody flex-container">
                    <div className="FeedBodyNav" >
                        <NavList isAdmin={user.role === 'admin'} />
                    </div>
                    <div className="FeedBodyContent">
                        {feedBodyContent}
                    </div>
                </div>

            </>
        )
    }

    return (
        redirect
            ? <Redirect to='/' />
            : <div className="Feed">{feed}</div>
    )
})

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authData.token || false,
        authError: state.authData.error,
        user: state.authData.user
    }
}

export default connect(mapStateToProps, { removeAuthData, setAuthData })(Feed)
