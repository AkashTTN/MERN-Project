import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import './Profile.css'
import defaultProfileImage from '../../assets/images/default-profile-image.png'

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
            <button className="btn-primary" onClick={onClick}>Go back</button>
            <img src={profilePicUrl || defaultProfileImage} alt="profile" />
            <div className="ProfileDetails flex-container">
                <p>Name</p>
                <p>{user.name}</p>
                <p>Email</p>
                <p>{user.email}</p>
                <p>Team</p>
                <p>{user.team}</p>
            </div>
        </div>
    )
}

export default Profile