import React, { useState } from 'react'

import Spinner from '../../UI/Spinner/Spinner'

import './Request.css'

const Request = ({ data, changeRequestStatus, index, loading }) => {

    const [viewRequest, setViewRequest] = useState(false)

    return (
        <div className="Request">
            <div className="RequestInfoPreview flex-container">
                <p>#{index}&nbsp;&nbsp;&nbsp;{data.name}</p>
                {
                    loading
                        ? <Spinner isMarginRequired={false} />
                        : null
                }
                <div className="RequestOptions">
                    <button
                        onClick={() => setViewRequest(prev => !prev)}
                        className="btn-primary">
                        {viewRequest ? 'Hide' : 'View'}
                    </button>
                    <button
                        onClick={(e) => changeRequestStatus({ status: e.target.name })}
                        name="rejected"
                        className="btn-primary btn-danger">
                        Reject
                    </button>
                    <button
                        onClick={(e) => changeRequestStatus({ status: e.target.name })}
                        name="approved"
                        className="btn-primary btn-success">
                        Approve
                    </button>
                </div>
            </div>
            {
                viewRequest
                &&
                <div className="RequestInfo flex-container">
                    <div>
                        <p className="RequestInfoHeading">Current</p>
                        <p>{data.name}</p>
                        <p>{data.team}</p>
                    </div>
                    <div>
                        <p className="RequestInfoHeading">New</p>
                        <p>{data.newProfileData.name}</p>
                        <p>{data.newProfileData.team}</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default Request
