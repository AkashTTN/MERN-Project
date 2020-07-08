import React, { useCallback, useState, useEffect } from 'react'
import { Redirect, Link, useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux'

import { removeAuthData, setAuthData, getFormConfig } from '../../store/actions'
import fetchImage from '../utils/fetchImage'

import NavList from '../NavList/NavList';
import Form from "../UI/Form/Form";
// import Posts from "../Posts/Posts";
import ComplaintsList from '../UI/ComplaintsList/ComplaintsList'
import Profile from '../Profile/Profile';
import InfinitePosts from '../InfiniteScroll/InfiniteScroll'
import Requests from '../Requests/Requests'
import ChatWindow from '../ChatWindow/ChatWindow'
import Search from '../Search/Search'

import './Feed.css'
import logo from '../../assets/images/ttn-logo.png'
import defaultProfileImage from '../../assets/images/default-profile-image.png'

const Feed = React.memo(({
    removeAuthData,
    setAuthData,
    getFormConfig,
    mode,
    user,
    otherUsers,
    onlyNavMode = false,
    isAuthenticated
}) => {

    const [redirect, setRedirect] = useState(false)
    const [profilePicUrl, setProfilePicUrl] = useState('')

    let feed = null
    let feedBodyContent = null
    let navMode = onlyNavMode

    switch (mode) {
        case 'buzz':
            feedBodyContent = (
                <>
                    <Form formType="Buzz" />
                    {/* <Posts /> */}
                    <InfinitePosts />
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
        case 'otherUserProfile':
            let userInfo = user
            let selfProfileMode = true
            let userPic = profilePicUrl
            navMode = true
            if (mode === 'otherUserProfile') {
                let { userIndex } = useParams()
                userInfo = otherUsers[userIndex]
                if (!userInfo) {
                    const history = useHistory()
                    history.goBack()
                } else {
                    // if user searches and selects his own account
                    if (user.googleId !== userInfo.googleId) {
                        selfProfileMode = false
                        userPic = userInfo.profilePicture
                    }
                }
            }
            feedBodyContent = (
                <>
                    <Profile selfMode={selfProfileMode} user={userInfo} profilePicUrl={userPic} />
                </>
            )
            break

        case 'myBuzz':
            feedBodyContent = (
                <>
                    <InfinitePosts mode={mode} />
                </>
            )
            break

        case 'requests':
            feedBodyContent = (
                <>
                    <Requests mode={mode} />
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
                    <div className="FeedHeaderContainer flex-container">
                        <Search />
                        <div className="Logout flex-container">
                            <Link
                                to="/profile"
                            >
                                <img className="ProfileImage" src={profilePicUrl || defaultProfileImage} alt="profile" />
                            </Link>
                            <span className="FeedHeaderGreeting">{`Hi ${user.name.split(' ')[0]}!`}</span>
                            <button className="LogoutButton" onClick={logoutHandler}>
                                Logout <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                    {
                        !navMode
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
                        !navMode
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
                    <div className={navMode ? 'flex-100' : 'flex-80'}>
                        {feedBodyContent}
                    </div>
                </div>

            </>
        )
    }

    return (
        redirect
            ? <Redirect to='/' />
            : <div className="Feed">
                {feed}
                <a className="scroll-top-btn" href="#">
                    <i className="fa-2x fas fa-arrow-up"></i>
                </a>
                <ChatWindow />
            </div>
    )
})

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.authData.token,
        user: state.authData.user,
        otherUsers: state.users.users
    }
}

export default connect(mapStateToProps, { removeAuthData, setAuthData, getFormConfig })(Feed)
