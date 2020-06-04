import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { getComplaints } from '../../../store/actions'

import ComplaintsListItem from './ComplaintsListItem/ComplaintsListItem'

import './ComplaintsList.css'

const ComplaintsList = ({ 
    isAdmin, 
    complaints, 
    getComplaints, 
    complaintSubmitted,
    errorComplaints,
    loading 
}) => {

    let complaintsArray = null
    let content = null

    useEffect(
        () => {
            if (complaintSubmitted) {
                getComplaints()
            }
        },
        [getComplaints, complaintSubmitted]
    )

    useEffect(
        () => {
            getComplaints()
        },
        [getComplaints]
    )

    if(errorComplaints) {
        content = <p>Something went wrong.</p>
    }

    if(loading) {
        content = <p>Loading...</p>
    }

    if (complaints && !errorComplaints) {
        if (complaints.length === 0) {
            content = <p>No complaints made yet.</p>
        } else {
            complaintsArray = complaints.map((item, index) => {
                return (
                    <ComplaintsListItem isAdmin={isAdmin} complaint={item} key={index} />
                )
            })
            content = (
                <>
                    <div className="ComplaintsListHeadings flex-container">
                        <div>Department</div>
                        <div>Issue Id</div>
                        {
                            isAdmin
                                ? <div>Locked By</div> : null
                        }
                        <div>Assigned To</div>
                        <div>Status</div>
                    </div>
                    {complaintsArray}
                </>
            )
        }
    }


    return (
        <div className="Complaints">
            <div className="ComplaintsHeader">
                <h3>Your Complaints</h3>
            </div>
            {content}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        complaints: state.complaint.complaints,
        errorComplaints: state.complaint.error,
        loading: state.complaint.loading,
        complaintSubmitted: state.form.complaintSubmitted,
        isAdmin: state.authData.user.role === 'admin'
    }
}

const mapDispatchToProps = {
    getComplaints
}

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintsList)