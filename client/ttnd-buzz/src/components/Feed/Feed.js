import React, { useCallback, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom';

import constants from '../config/constants'

import './Feed.css'

const Feed = () => {

    const [redirect, setRedirect] = useState(false)
    const [user, setUser] = useState(null)

    
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

    let feed = null

    if (user) {
        feed = (
            <>
                <p>Welcome {user.name}</p>
                <p>{user.feed}</p>
                <button onClick={logoutHandler}>Logout</button>
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