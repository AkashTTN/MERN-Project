import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import './Profile.css'

const Profile = ({ profilePicUrl, user }) => {

    const history = useHistory()

    const onClick = useCallback(
        () => {
            history.goBack()
        },
        [history]
    )

    return (
        <div className="Profile flex-container">
            <button onClick={onClick}>Go back</button>
            <img src={profilePicUrl} alt="profile" />
            <div className="ProfileDetails flex-container">
                <p>Name</p>
                <p>{user.name}</p>
                <p>Email</p>
                <p>{user.email}</p>
                <p>Team</p>
                <p>{user.team}</p>
            </div>
            <div className="filler"></div>
        </div>
    )
}

export default Profile