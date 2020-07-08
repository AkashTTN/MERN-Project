import React, { useCallback, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { submitForm } from '../../store/actions'
import Spinner from '../UI/Spinner/Spinner'
import { changeFriendStatus, changeFollowStatus } from '../../store/actions/auth'

import './Profile.css'
import defaultProfileImage from '../../assets/images/default-profile-image.png'

const Profile = ({
    selfMode = true,
    profilePicUrl,
    user,
    formConfig,
    submitForm,
    changeFollowStatus,
    changeFriendStatus,
    isLoading, currentUserId }) => {

    const [editMode, setEditMode] = useState(false)
    const [profileData, setProfileData] = useState({
        name: user.name,
        team: user.team
    })
    const [editErrors, setEditErrors] = useState({})

    const history = useHistory()

    useEffect(() => {
        setEditErrors({})
        setProfileData({
            name: user.name,
            team: user.team
        })
    }, [editMode, setEditErrors, setProfileData, user])

    const onSubmit = () => {
        if (editErrors.length > 0) {
            setEditErrors((prevValue) => 'Cannot submit request.' + prevValue)
        } else {
            submitForm({ data: JSON.stringify(profileData), editMode: true, type: 'Profile' })
        }
    }

    const onClick = useCallback(
        () => {
            history.goBack()
        },
        [history]
    )

    const onChange = useCallback(
        (e) => {
            const { name, value } = e.target

            setProfileData((prevData) => ({
                ...prevData,
                [name]: value
            }))

            switch (name) {
                case 'name':
                    editErrors.nameError = value.trim().length === 0
                        ? 'Name cannot be empty' : ''
                    break
                default: return
            }

        },
        [setProfileData, editErrors]
    )

    const toggleEditMode = useCallback(
        () => {
            setEditMode((prevValue) => !prevValue)
        },
        [setEditMode]
    )

    const handleChangeSocialConnect = useCallback(
        (e) => {
            switch (e.target.name) {
                case 'friendButton':
                    const isFriend = user.friends.includes(currentUserId)
                    changeFriendStatus({ changedStatus: !isFriend, userId: user.googleId })
                    break
                case 'followButton':
                    const isFollowing = user.followers.includes(currentUserId)
                    changeFollowStatus({ changedStatus: !isFollowing, userId: user.googleId })
                    break
                default: return 'Wrong choice'
            }
        },
        [changeFriendStatus, changeFollowStatus, user, currentUserId]
    )

    return (
        <div className="Profile flex-container">
            <button className="btn-primary" onClick={onClick}>Go back</button>
            <div className="ProfileDetails flex-container">
                {
                    selfMode &&
                    <i
                        onClick={toggleEditMode}
                        className="UpdateProfileButton fas fa-edit"></i>
                }
                <img src={profilePicUrl || defaultProfileImage} alt="profile" />
                {
                    user.updateStatus
                    && <span className="ProfileUpdateStatus">Pending</span>
                }
                <p>Name</p>
                {
                    editErrors.nameError
                    && <p style={{ paddingBottom: "5px" }}
                        className="error">{editErrors.nameError}</p>
                }
                {
                    editMode
                        ? <input
                            className="ProfileUpdateField"
                            onChange={onChange}
                            name="name"
                            type="text" value={profileData.name}></input>
                        : <p>{user.name}</p>
                }
                <p>Email</p>
                <p>{user.email}</p>
                <p>Team</p>
                {
                    editMode
                        ? <select
                            value={profileData.team}
                            onChange={onChange}
                            className="ProfileUpdateField"
                            name="team" id="team" >
                            {
                                formConfig
                                    ? formConfig.teams.map(((teamName) => {
                                        return (
                                            <option
                                                key={teamName}
                                                value={teamName.toUpperCase()}
                                            >{teamName}</option>
                                        )
                                    })) : null
                            }
                        </select>
                        : <p>{user.team}</p>
                }
                {
                    !selfMode &&
                    <div className="SocialConnectOptions">
                        <button
                            onClick={handleChangeSocialConnect}
                            name="followButton"
                            className="SocialConnectButton FollowButton">
                            {
                                user.followers.includes(currentUserId)
                                    ? '- Unfollow' : '+ Follow'
                            }
                        </button>
                        <button
                            onClick={handleChangeSocialConnect}
                            name="friendButton"
                            className="SocialConnectButton FriendButton">
                            {
                                user.friends.includes(currentUserId)
                                    ? '- Unfriend' : '+ Make friend'
                            }
                        </button>
                    </div>
                }
                <div className="SocialInfoBadges">
                    <span className="Badge bg-purple">{user.friends.length}&nbsp;Friends</span>
                    <span>&nbsp;&middot;&nbsp;</span>
                    <span className="Badge bg-olive">{user.followers.length}&nbsp;Followers</span>
                    <span>&nbsp;&middot;&nbsp;</span>
                    <span className="Badge bg-maroon">{user.following.length}&nbsp;Following</span>
                </div>
                {
                    editMode
                        ? <i
                            onClick={onSubmit}
                            className="UpdateProfileSubmit fas fa-check"></i>
                        : null
                }
                {
                    isLoading
                    &&
                    <Spinner isMarginRequired={false} />
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        formConfig: state.form.formConfig,
        isLoading: state.form.loading,
        currentUserId: state.authData.user.googleId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitForm: (data) => dispatch(submitForm(data)),
        changeFollowStatus: (data) => dispatch(changeFollowStatus(data)),
        changeFriendStatus: (data) => dispatch(changeFriendStatus(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)