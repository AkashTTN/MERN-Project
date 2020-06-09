import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'

import { getComplaints } from '../../../store/actions'

import ComplaintsListItem from './ComplaintsListItem/ComplaintsListItem'
import Pagination from '../../UI/Pagination/Pagination'

import './ComplaintsList.css'

const ComplaintsList = ({
    isAdmin,
    complaints,
    totalComplaints,
    getComplaints,
    complaintSubmitted,
    errorComplaints,
    loading,
    mode
}) => {

    let complaintsArray = null
    let content = null

    const [currentPage, setCurrentPage] = useState(1)
        , [complaintsPerPage] = useState(10)

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
            if (currentPage > 1) {
                getComplaints({
                    limit: complaintsPerPage,
                    skip: currentPage * complaintsPerPage - complaintsPerPage
                })
            } else {
                getComplaints({})
            }
        },
        [getComplaints, currentPage, complaintsPerPage]
    )

    const paginate = useCallback(
        (pageNumber) => {
            setCurrentPage(pageNumber)
        },
        [setCurrentPage]
    )

    if (errorComplaints) {
        content = <p>Something went wrong.</p>
    } else if (loading) {
        content = <p>Loading...</p>
    } else if (complaints.length === 0) {
        content = <p>No complaints made yet.</p>
    } else {
        complaintsArray = complaints.map((item, index) => {
            return (
                <ComplaintsListItem
                    isAdmin={isAdmin}
                    mode={mode}
                    complaint={item}
                    key={index}
                />
            )
        })
        content = (
            <table className="ComplaintsList">
                {/* <div className="ComplaintsListHeadings flex-container">
                    <div>Department</div>
                    <div>Issue Id</div>
                    {
                        isAdmin && (mode === 'resolved')
                            ? <div>Locked By</div> : null
                    }
                    <div>Assigned To</div>
                    <div>Status</div>
                </div> */}
                <thead className="ComplaintsListHeadings">
                    <tr className="ComplaintsListRow">
                        <th>Department</th>
                        <th>Issue Id</th>
                        {
                            isAdmin && (mode === 'resolved')
                                ? <th>Locked By</th> : null
                        }
                        <th>Assigned To</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {complaintsArray}
                </tbody>
            </table>
        )
    }

    return (
        <div className="Complaints">
            <div className="ComplaintsHeader">
                <h3>Your Complaints</h3>
            </div>
            {content}
            {
                (complaints.length < totalComplaints) && <Pagination
                    documentsPerPage={complaintsPerPage}
                    totalDocuments={totalComplaints}
                    paginate={paginate}
                />
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        complaints: state.complaint.complaints,
        totalComplaints: state.complaint.totalComplaints,
        errorComplaints: state.complaint.error,
        loading: state.complaint.loading,
        complaintSubmitted: state.form.complaintSubmitted,
        isAdmin: state.authData.user.role === 'admin'
    }
}

const mapDispatchToProps = dispatch => {
    return { getComplaints: (data) => dispatch(getComplaints(data)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintsList)