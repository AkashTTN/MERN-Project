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
    errorComplaints,
    loading,
    formConfig,
    mode
}) => {

    let complaintsArray = null
    let content = null

    const [currentPage, setCurrentPage] = useState(1)
        , [complaintsPerPage] = useState(5)
        , [complaintFilterType, setComplaintFilterType] = useState('')

    useEffect(
        () => {
            getComplaints({
                limit: complaintsPerPage,
                statusFilter: complaintFilterType,
                skip: currentPage * complaintsPerPage - complaintsPerPage,
                mode
            })
        },
        [
            getComplaints,
            mode,
            currentPage,
            complaintFilterType, complaintsPerPage]
    )

    const paginate = useCallback(
        (pageNumber) => {
            setCurrentPage(pageNumber)
        },
        [setCurrentPage]
    )

    const handleComplaintStatusFilter = (filterType) => {

        setComplaintFilterType(filterType)

    }

    if (errorComplaints) {
        content = <p>Something went wrong.</p>
    } else if (loading) {
        content = <p>Loading...</p>
    } else if (complaints.length === 0) {
        content = <p>No complaints made {['None', ''].includes(complaintFilterType) ? '' : 'under this category'} yet.</p>
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
            <div className="ComplaintsHeader flex-container">
                <h3>Your Complaints</h3>
                {
                    !errorComplaints 
                    && <span className="ComplaintsFilter">
                        <i className="fas fa-filter"></i>
                        <select
                            value={complaintFilterType}
                            onChange={(e) => handleComplaintStatusFilter(e.target.value)}
                            name="complaintStatusFilter"
                            className="ComplaintStatusFilter"
                        >
                            <option value='' disabled hidden >Filter</option>
                            <option value='None' >None</option>
                            {
                                formConfig
                                    ? formConfig.complaint.statusTypes.map((type, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={type}>
                                                {type}
                                            </option>
                                        )
                                    })
                                    : null
                            }
                        </select>
                    </span>
                }
            </div>
            <div className="complaints-list-content-wrapper">
                {content}
            </div>
            {
                ((complaintsPerPage < totalComplaints) && !errorComplaints) &&
                <Pagination
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
        isAdmin: state.authData.user.role === 'admin',
        formConfig: state.form.formConfig
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getComplaints: (data) => dispatch(getComplaints(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintsList)