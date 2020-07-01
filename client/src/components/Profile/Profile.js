import React, { useCallback, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { submitForm } from '../../store/actions'
import Spinner from '../UI/Spinner/Spinner'

import './Profile.css'
import defaultProfileImage from '../../assets/images/default-profile-image.png'

const Profile = ({ profilePicUrl, user, formConfig, submitForm, isLoading }) => {

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
        if(editErrors.length > 0) {
            setEditErrors((prevValue) => 'Cannot submit request.'+prevValue)
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

    return (
        <div className="Profile flex-container">
            <button className="btn-primary" onClick={onClick}>Go back</button>
            <div className="ProfileDetails flex-container">
                <i
                    onClick={toggleEditMode}
                    className="UpdateProfileButton fas fa-edit"></i>
                <img src={profilePicUrl || defaultProfileImage} alt="profile" />
                {
                    user.updateStatus
                    && <span className="ProfileUpdateStatus">{user.updateRequests+' Pending'}</span>
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
        isLoading: state.form.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitForm: (data) => dispatch(submitForm(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)