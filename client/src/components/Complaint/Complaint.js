import React from 'react'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import Images from '../UI/Images/Images'

import './Complaint.css'

const Complaint = ({ complaints, isAuthenticated }) => {


    const { id } = useParams()

    const history = useHistory()

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
            <div className="ComplaintDetails">
                <h3>Complaint Details</h3>
                <p>Id: {complaint.complaintId}</p>
                <p>Created At: {new Date(complaint.createdAt).toDateString()}</p>
                <p>Status: {complaint.status}</p>
                <p>Locked By: {complaint.createdBy.name}</p>
                <p>Assigned To: {complaint.assignedTo.name}</p>
                <p>Issue Title: {complaint.issueTitle}</p>
                <p>Department: {complaint.department}</p>
                <p>Concern: {complaint.text}</p>
                <p>Attached Images: </p>
                <Images imageUrl={complaint.imageUrl} type='complaint' />
            </div>
        )
    }

    return (
        <div className="Complaint">
            <button onClick={() => history.goBack()}>Back</button>
            {content}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        complaints: state.complaint.complaints,
        isAuthenticated: !!state.authData.token
    }
}

export default connect(mapStateToProps)(Complaint)