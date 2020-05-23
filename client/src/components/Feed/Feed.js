import React, { useCallback, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom';

import constants from '../config/constants'

import './Feed.css'
import NavList from '../NavList/NavList';
import Form from '../UI/Form/Form'
import ComplaintsList from '../UI/ComplaintsList/ComplaintsList';

const Feed = () => {

    const [redirect, setRedirect] = useState(false)
    const [user, setUser] = useState(null)
    const [mode, setMode] = useState('BUZZ')


    const getFeedData = useCallback(
        (token) => {
            fetch(constants.SERVER_URL + '/user/feed', {
                headers: {
                    'Authorization': 'bearer ' + token
                }
            })
                .then(res => res.json())
                .then(data => {
                    setUser(data.user)
                })
                .catch(err => {
                    setRedirect(true)
                })
        },
        []
    )

    useEffect(
        () => {


            // Check local storage for saved token
            let token = window.localStorage.getItem('token')
            if (token) {
                getFeedData(token)
            } else {
                // Check query string for token
                const urlParams = new URLSearchParams(window.location.search);
                token = urlParams.get('token')
                if (!token) {
                    setRedirect(true)
                } else {
                    getFeedData(token)
                }
            }

        },
        [setUser, setRedirect, getFeedData]
    )

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
}

export default Feed
