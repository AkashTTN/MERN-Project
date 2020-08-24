import React, { useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { submitForm } from '../../store/actions'
import Spinner from '../UI/Spinner/Spinner'
import Modal from '../UI/Modal/Modal'
import Badge from '../Badge/Badge'
import { changeFriendStatus, changeFollowStatus, getUserSocialData } from '../../store/actions/index'
import CustomAvatar from '../UI/CustomAvatar/CustomAvatar'

import './Profile.css'

const Profile = ({
    user,
    userError,
    userLoading,
    userSocialData,
    socialDataError,
    socialDataLoading,
    formConfig,
    submitForm,
    changeFollowStatus,
    changeFriendStatus,
    getUserSocialData,
    isLoading, currentUserId }) => {

    const [editMode, setEditMode] = useState(false)
    const [profileData, setProfileData] = useState({
        name: user && user.name,
        team: user && user.team
    })
    const [editErrors, setEditErrors] = useState({})
    const [showFollowersModal, setShowFollowersModal] = useState(false)
    const [showFollowingModal, setShowFollowingModal] = useState(false)
    const [showFriendsModal, setShowFriendsModal] = useState(false)

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

    let content = null

    if (!userLoading && !userError && user) {
        content = (
            <>
                {
                    currentUserId === user.googleId &&
                    <i
                        onClick={toggleEditMode}
                        className="UpdateProfileButton fas fa-edit"></i>
                }
                <CustomAvatar src={user.profilePicture} alt={user.name} />
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
                    currentUserId !== user.googleId &&
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
                    <Badge
                        name='Friends'
                        data={user} fetchData={getUserSocialData}
                        color='purple' showModal={setShowFriendsModal} />
                    <span>&nbsp;&middot;&nbsp;</span>
                    <Badge
                        name='Followers' data={user}
                        fetchData={getUserSocialData} color='olive'
                        showModal={setShowFollowersModal} />
                    <span>&nbsp;&middot;&nbsp;</span>
                    <Badge
                        name='Following'
                        data={user} fetchData={getUserSocialData}
                        color='maroon' showModal={setShowFollowingModal} />
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
                {
                    showFollowersModal &&
                    <Modal heading="Followers" closeModal={() => setShowFollowersModal(false)} >
                        {
                            socialDataError && <p>Something went wrong.</p>
                        }
                        {
                            socialDataLoading && <p>Loading...</p>
                        }
                        {
                            !socialDataLoading && !socialDataError &&
                            <div className="users-list">
                                {
                                    userSocialData.followers.length !== 0
                                        ? userSocialData.followers.map(follower => {
                                            return <p key={follower.googleId}>{follower.name + ' - ' + follower.email}</p>
                                        })
                                        : <p>No followers yet.</p>
                                }
                            </div>
                        }
                    </Modal>
                }
                {
                    showFollowingModal &&
                    <Modal heading="Following" closeModal={() => setShowFollowingModal(false)} >
                        {
                            socialDataError && <p>Something went wrong.</p>
                        }
                        {
                            socialDataLoading && <p>Loading...</p>
                        }
                        {
                            !socialDataLoading && !socialDataError &&
                            <div className="users-list">
                                {
                                    userSocialData.following.length !== 0
                                        ? userSocialData.following.map(user => {
                                            return <p key={user.googleId}>{user.name + ' - ' + user.email}</p>
                                        })
                                        : <p>You are not following anyone.</p>
                                }
                            </div>
                        }
                    </Modal>
                }
                {
                    showFriendsModal &&
                    <Modal heading="Friends" closeModal={() => setShowFriendsModal(false)} >
                        {
                            socialDataError && <p>Something went wrong.</p>
                        }
                        {
                            socialDataLoading && <p>Loading...</p>
                        }
                        {
                            !socialDataLoading && !socialDataError &&
                            <div className="users-list">
                                {
                                    userSocialData.friends.length !== 0
                                        ? userSocialData.friends.map(user => {
                                            return <p key={user.googleId}>{user.name + ' - ' + user.email}</p>
                                        })
                                        : <p>No friends yet.</p>
                                }
                            </div>
                        }
                    </Modal>
                }
            </>
        )
    }

    return (
        <div className="Profile flex-container">
            <button className="btn-primary" onClick={onClick}>Go back</button>
            <div className="ProfileDetails flex-container">
                {
                    userLoading && <p>Loading</p>
                }
                {
                    userError && <p>Something went wrong</p>
                }
                {content}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        formConfig: state.form.formConfig,
        isLoading: state.form.loading,
        currentUserId: state.authData.user.googleId,
        user: state.search.selectedUser,
        userLoading: state.search.selectedUserLoading,
        userError: state.search.selectedUserError,
        userSocialData: state.social.socialData,
        socialDataError: state.social.error,
        socialDataLoading: state.social.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitForm: (data) => dispatch(submitForm(data)),
        changeFollowStatus: (data) => dispatch(changeFollowStatus(data)),
        changeFriendStatus: (data) => dispatch(changeFriendStatus(data)),
        getUserSocialData: (userId) => dispatch(getUserSocialData(userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)