import React from 'react'

import './ComplaintsListItem.css'

const ComplaintsListItem = ({ isAdmin, complaint }) => {

    return (
        <div className="ComplaintsListItem flex-container">
            <div>{complaint.department}</div>
            <div>{complaint.issueId}</div>
            {
                isAdmin
                    ? <div>{complaint.createdBy.name}</div> : null
            }
            <div>{complaint.assignedTo.name}</div>
            <div>{complaint.status}</div>
        </div>
    )
}

export default ComplaintsListItem