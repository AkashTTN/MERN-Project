import React, { useCallback, useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'

import { removeAuthData, setAuthData, getFormConfig } from '../../store/actions'
import fetchImage from '../utils/fetchImage'

import NavList from '../NavList/NavList';
import Form from "../UI/Form/Form";
import Posts from "../Posts/Posts";
import ComplaintsList from '../UI/ComplaintsList/ComplaintsList'
import Profile from '../Profile/Profile';

import './Feed.css'
import logo from '../../assets/images/ttn-logo.png'

const Feed = React.memo(({
    removeAuthData,
    setAuthData,
    getFormConfig,
    mode,
    user,
    isAuthenticated
}) => {

    const [redirect, setRedirect] = useState(false)
    const [profilePicUrl, setProfilePicUrl] = useState('')

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
                    <ComplaintsList mode={mode} />
                </>
            )
            break

        case 'resolved':
            feedBodyContent = (
                <>
                    <ComplaintsList mode={mode} />
                </>
            )
            break

        case 'profile':
            feedBodyContent = (
                <>
                    <Profile user={user} profilePicUrl={profilePicUrl} />
                </>
            )
            break

        default: feedBodyContent = <p>Incorrect feed mode.</p>

    }

    useEffect(() => {
        if (user) {
            (async function () {
                const image = await fetchImage(user.profilePicture)
                setProfilePicUrl(image)
            })()
        }
    }, [setProfilePicUrl, user])

    // with redux
    useEffect(
        () => {
            if (!isAuthenticated) {
                if (window.localStorage.getItem('token')) {
                    setAuthData()
                    getFormConfig()
                } else {
                    setRedirect(true)
                }
            }
        },
        [setRedirect, isAuthenticated, setAuthData, getFormConfig]
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
                        <Link
                            to="/profile"
                        >
                            <img className="ProfileImage" src={profilePicUrl} alt="profile" />
                        </Link>
                        <span className="FeedHeaderGreeting">{`Hi ${user.name.split(' ')[0]}!`}</span>
                        <button className="LogoutButton" onClick={logoutHandler}>
                            Logout <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                    {
                        mode !== 'profile'
                        &&
                        <div className="FeedHeaderImage flex-container darken">
                            {
                                mode === 'buzz'
                                    ? <p>POSTING YOUR THOUGHTS</p>
                                    : <p>CREATING BUZZ AROUND YOU</p>
                            }
                            <p>NEVER BEEN SO EASY..</p>
                        </div>
                    }
                    <a href="/buzz">
                        <img className="FeedHeaderLogo" src={logo} alt="TTN-Logo" />
                    </a>
                </div>
                <div className="FeedBody flex-container">
                    {
                        mode !== 'profile'
                        &&
                        <div className="FeedBodyNav" >
                            <NavList isAdmin={user.role === 'admin'} />
                            <div className="flex-container links-container">
                                <p>
                                    &copy; 2020 To The New Digital
                                </p>
                                <div>
                                    <a href="/help">Help</a>
                                    <a href="/about-us">About</a>
                                </div>
                            </div>
                        </div>
                    }
                    <div className={mode === 'profile' ? 'flex-100' : 'flex-80'}>
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
        isAuthenticated: !!state.authData.token,
        user: state.authData.user
    }
}

export default connect(mapStateToProps, { removeAuthData, setAuthData, getFormConfig })(Feed)
