import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { changeComplaintStatus } from '../../../../store/actions'

import inputClasses from './ComplaintsListItem.module.css'

const ComplaintsListItem = ({ isAdmin, complaint, changeComplaintStatus }) => {

    let classes = ['ComplaintField', inputClasses.ComplaintStatus]

    let statusDropDown = null

    classes.push(inputClasses[complaint.status])

    const handleOnChange = useCallback(
        (e) => {
            changeComplaintStatus({ complaintId: complaint.complaintId, status: e.target.value })
        },
        [changeComplaintStatus, complaint.complaintId]
    )

    if (isAdmin) {
        statusDropDown = (
            <div className={classes.ComplaintStatusToggleDiv}>
                <select value={complaint.status} onChange={handleOnChange} className={classes.join(' ')} name="complaintStatus" id="complaintStatus" required>
                    <option className={inputClasses.Black} value="Open">Open</option>
                    <option className={inputClasses.Black} value="Resolved">Resolved</option>
                    <option className={inputClasses.Black} value="In Progress">In Progress</option>
                </select>
            </div>
        )
    }

    const statusComponent = (
        isAdmin
            ? statusDropDown
            : <div>{complaint.status}</div>
    )

    return (
        <div className={[inputClasses.ComplaintsListItem, 'flex-container'].join(' ')}>
            <div>{complaint.department}</div>
            <div>{complaint.complaintId}</div>
            {
                isAdmin
                    ? <div>{complaint.createdBy.name}</div> : null
            }
            <div>{complaint.assignedTo.name}</div>
            {statusComponent}
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        changeComplaintStatus: (data) => dispatch(changeComplaintStatus(data))
    }
}

export default connect(null, mapDispatchToProps)(ComplaintsListItem)