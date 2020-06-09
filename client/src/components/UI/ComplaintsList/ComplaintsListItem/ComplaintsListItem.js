import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { changeComplaintStatus } from '../../../../store/actions'

import inputClasses from './ComplaintsListItem.module.css'

const complaintStatusMap = {
    Resolved: 'Resolved',
    Open: 'Open',
    'In Progress': 'InProgress'
}

const ComplaintsListItem = ({
    isAdmin,
    mode,
    complaint,
    changeComplaintStatus,
    formConfig,
    formConfigError
}) => {

    let classes = [inputClasses.ComplaintStatusToggle, inputClasses.ComplaintStatus]

    let statusDropDown = null

    classes.push(inputClasses[complaintStatusMap[complaint.status]])

    const handleOnChange = useCallback(
        (e) => {
            changeComplaintStatus({
                complaintId: complaint.complaintId,
                status: e.target.value
            })
        },
        [changeComplaintStatus, complaint.complaintId]
    )

    if (isAdmin && (mode === 'resolved')) {
        statusDropDown = (
            <td>
                <select
                    value={complaint.status}
                    onChange={handleOnChange}
                    className={classes.join(' ')}
                    name="complaintStatus"
                    required
                >
                    {
                        formConfig ? formConfig.complaint.statusTypes.map((type, index) => {
                            return (
                                <option
                                    className={inputClasses.Black}
                                    key={index}
                                    value={type}>
                                    {type}
                                </option>
                            )
                        }) : null
                    }
                    {/* <option className={inputClasses.Black} value="Open">Open</option>
                    <option className={inputClasses.Black} value="Resolved">Resolved</option>
                    <option className={inputClasses.Black} value="In Progress">In Progress</option> */}
                </select>
            </td>
        )
    }

    const statusComponent = (
        isAdmin && (mode === 'resolved')
            ? statusDropDown
            : <td className={inputClasses[complaintStatusMap[complaint.status]]}>
                {complaint.status}
            </td>
    )

    return (
        // <div className={[inputClasses.ComplaintsListItem, 'flex-container'].join(' ')}>
        //     <div>{complaint.department}</div>
        //     <div>
        //         <Link to={`/complaints/${complaint.complaintId}`}>
        //             <div className={inputClasses.ComplaintId}>{complaint.complaintId}</div>
        //         </Link>
        //     </div>
        //     {
        //         isAdmin && (mode === 'resolved')
        //             ? <div>{complaint.createdBy.name}</div> : null
        //     }
        //     <div>{complaint.assignedTo.name}</div>
        //     {statusComponent}
        // </div>
        <tr className="ComplaintsListRow">
            <td>{complaint.department}</td>
            <td>
                <Link to={`/complaints/${complaint.complaintId}`}>
                    <div className={inputClasses.ComplaintId}>{complaint.complaintId}</div>
                </Link>
            </td>
            {
                isAdmin && (mode === 'resolved')
                    ? <td>{complaint.createdBy.name}</td> : null
            }
            <td>{complaint.assignedTo.name}</td>
            {statusComponent}
        </tr>
    )
}

const mapStateToProps = state => {
    return {
        formConfig: state.form.formConfig,
        formConfigError: state.form.formConfigError
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeComplaintStatus: (data) => dispatch(changeComplaintStatus(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintsListItem)