import React, { useCallback, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import Images from '../UI/Images/Images'
import { updateComplaint } from '../../store/actions'

import './Complaint.css'

const Complaint = ({
    complaints,
    userId,
    isAuthenticated,
    updateComplaint, complaintUpdated }) => {

    const { id } = useParams()
    const history = useHistory()
    const [editMode, setEditMode] = useState(false)
    const [data, setData] = useState({
        concernText: ''
    })
    const [isUpdated, setIsUpdated] = useState(complaintUpdated)
    const [isEditing, setIsEditing] = useState(false)
    const [complaintUpdateError, setComplaintUpdateError] = useState('')

    useEffect(
        () => {
            setIsUpdated(complaintUpdated)
            if (complaintUpdated) {
                setData({
                    concernText: ''
                })
                setComplaintUpdateError('')
            }
        },
        [setIsUpdated, setData, complaintUpdated, setComplaintUpdateError]
    )

    const handleOnClick = useCallback(
        () => {
            setEditMode((prevMode => !prevMode))
        },
        [setEditMode]
    )

    const handleOnChange = useCallback(
        (e) => {
            setIsEditing(true)
            setIsUpdated(false)
            const newData = { [e.target.name]: e.target.value }
            setComplaintUpdateError(e.target.value.trim().length <= 0 ? 'Empty text not allowed' : '')
            setData((prevData) => ({ ...prevData, ...newData }))
        },
        [setData, setIsUpdated, setIsEditing, setComplaintUpdateError]
    )

    const handleOnSubmit = () => {
        setIsEditing(false)
        if(!complaintUpdateError) {
            updateComplaint({
                complaintId: complaint.complaintId,
                concernText: data.concernText
            })
        }
    }

    if (!isAuthenticated) {
        history.push('/')
    }

    let complaint

    if (complaints) {
        complaint = complaints.find((complaint) => {
            return complaint.complaintId === id
        })
    }

    let content = <p>Complaint Not Found</p>

    if (complaint) {
        content = (
            <>
                <div className="ComplaintDetails">
                    <h3>
                        Complaint Details
                        {
                            complaint.status !== 'Resolved'
                                && (userId === complaint.createdBy.googleId)
                                ? <i
                                    style={{ marginLeft: "10px", cursor: "pointer" }}
                                    onClick={handleOnClick}
                                    className="fas fa-edit"></i>
                                : null
                        }
                    </h3>
                    {
                        !isUpdated && !isEditing && editMode
                        && <p className="error">Complaint could not be updated. Try later.</p>
                    }
                    <p>Id: {complaint.complaintId}</p>
                    <p>Created At: {new Date(complaint.createdAt).toDateString()}</p>
                    <p>Status: {complaint.status}</p>
                    <p>Locked By: {complaint.createdBy.name}</p>
                    <p>Assigned To: {complaint.assignedTo.name}</p>
                    <p>Issue Title: {complaint.issueTitle}</p>
                    <p>Department: {complaint.department}</p>
                    <p>Concern: {complaint.text}</p>
                    {
                        complaintUpdateError && editMode
                        && <p className="error">{complaintUpdateError}</p>
                    }
                    {
                        editMode
                        && <textarea
                            placeholder="New Text"
                            onChange={handleOnChange}
                            name="concernText"
                            value={data.concernText}
                            style={{ width: "100%", padding: "5px", marginBottom: "10px" }}>
                        </textarea>
                    }
                    {
                        editMode
                        && <div className="ComplaintDetailsEditButtons">
                            <button
                                style={{ marginRight: "10px" }}
                                onClick={handleOnClick}
                                className="btn-primary"
                            >{isUpdated ? 'Done' : 'Cancel'}</button>
                            {
                                isEditing
                                && <button
                                    type="submit"
                                    className="btn-primary" onClick={handleOnSubmit} >
                                    Save</button>
                            }
                        </div>
                    }
                </div>
                <div className="ComplaintImages">
                    <p>Attached Images: </p>
                    <Images imageUrl={complaint.imageUrl} type='complaint' />
                </div>
            </>
        )
    }

    return (
        <div className="Complaint">
            <button className="btn-primary" onClick={() => history.goBack()}>Back</button>
            {content}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        complaints: state.complaint.complaints,
        isAuthenticated: !!state.authData.token,
        userId: state.authData.user.googleId,
        complaintUpdated: state.complaint.complaintUpdated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateComplaint: (data) => dispatch(updateComplaint(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Complaint)