import React, { useCallback, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux'
import constants from '../config/constants'
import { setAuthData } from '../../store/actions'

import NavList from '../NavList/NavList';
import Form from '../UI/Form/Form'
import Posts from '../Posts/Posts'
import ComplaintsList from '../UI/ComplaintsList/ComplaintsList';

import './Feed.css'

const Feed = React.memo(({ user, error, setAuthData }) => {

    const [redirect, setRedirect] = useState(false)
    // without redux
    // const [token, setToken] = useState(null)
    // const [user, setUser] = useState(null)
    const [mode, setMode] = useState('BUZZ')


    // const makeRequest = useCallback(
    //     ({ endpoint, queryString = null, formData = null } = {}) => {
    //         let requestHeaders = {
    //             'Authorization': 'bearer ' + token,
    //         }
    //         let requestURL = constants.SERVER_URL + endpoint

    //         if (queryString) {
    //             requestURL += queryString
    //         } else if (formData) {
    //             requestHeaders['body'] = formData
    //         }

    //         fetch(requestURL, {
    //             headers: {
    //                 ...requestHeaders
    //             }
    //         })
    //             .then(res => res.json())
    //             .then(data => {
    //                 setUser(data.user)
    //             })
    //             .catch(err => {
    //                 setRedirect(true)
    //             })

    //     },
    //     [setRedirect, setUser]
    // )

    // without redux
    // const getFeedData = useCallback(
    //     (token) => {
    //         fetch(constants.SERVER_URL + '/user/feed', {
    //             headers: {
    //                 'Authorization': 'bearer ' + token
    //             }
    //         })
    //             .then(res => res.json())
    //             .then(res => {
    //                 setUser(res.data.user)
    //             })
    //             .catch(err => {
    //                 setRedirect(true)
    //             })
    //     },
    //     [setRedirect, setUser]
    // )

    // useEffect(
    //     () => {

    //         // Check local storage for saved token
    //         let token = window.localStorage.getItem('token')
    //         if (token) {
    //             setToken(token)
    //             getFeedData(token)
    //         } else {
    //             // Check query string for token
    //             const urlParams = new URLSearchParams(window.location.search);
    //             token = urlParams.get('token')
    //             if (!token) {
    //                 setRedirect(true)
    //             } else {
    //                 setToken(token)
    //                 getFeedData(token)
    //             }
    //         }

    //     },
    //     [setUser, setToken, setRedirect, getFeedData]
    // )

    // with redux
    useEffect(
        () => {
            setAuthData()
        },
        [setAuthData]
    )

    if (error) {
        setRedirect(true)
    }

    const logoutHandler = useCallback(
        () => {

            // fetch(constants.SERVER_URL + '/auth/logout', { method: 'DELETE' })
            //     .then(response => {
            //         if (response.status === 200) {
            //             setRedirect(true)
            //         }
            //     })

            // Remove token from storage
            window.localStorage.removeItem('token')
            setRedirect(true)

        },
        [setRedirect]
    )

    const changeModeHandler = useCallback(
        (newMode) => {
            console.log('fired', newMode)
            setMode(newMode)
        },
        [setMode]
    )

    let feed = null

    let feedBodyContent = null

    switch (mode) {
        case 'BUZZ':
            feedBodyContent = (
                <>
                    <Form formType="Buzz" />
                    <Posts />
                </>
            )
            break

        case 'COMPLAINTS':
            feedBodyContent = (
                <>
                    <Form formType="Complaint" />
                    <ComplaintsList />
                </>
            )
            break

        case 'RESOLVED':
            break

        default:
            break;
    }

    if (user) {
        feed = (
            <>
                <div className="FeedHeader">
                    <p>Welcome {user.name}</p>
                    <button onClick={logoutHandler}>Logout</button>
                </div>
                <div className="FeedBody flex-container">
                    <div className="FeedBodyNav" >
                        <NavList isAdmin={user.role === 'admin'} changeFeedMode={changeModeHandler} />
                    </div>
                    <div className="FeedBodyContent" >
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
        error: state.authData.error,
        user: state.authData.user
    }
}

const mapDispatchToProps = {
    setAuthData
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed)
