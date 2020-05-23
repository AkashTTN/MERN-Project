import React from 'react'

import ComplaintsListItem from './ComplaintsListItem/ComplaintsListItem'

import './ComplaintsList.css'

const ComplaintsList = () => {

    const data = []

    const list = data.map((item, index) => {
        return (
            <ComplaintsListItem data={item} key={index} />
        )
    })

    return (
        <div className="Complaints">
            <div className="ComplaintsHeader">
                <h3>Your Complaints</h3>
                <div className="ComplaintsListHeadings flex-container">
                    <div>Department</div>
                    <div>Issue Id</div>
                    <div>Assigned To</div>
                    <div>Status</div>
                </div>
            </div>
            {list}
        </div>
    )
}

export default ComplaintsList