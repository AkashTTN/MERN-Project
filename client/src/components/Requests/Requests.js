import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import Request from './Request/Request'
import { getRequests, changeProfileRequestStatus } from '../../store/actions'

import './Requests.css'

const Requests = ({ loading, requests, getRequests, changeProfileRequestStatus }) => {

    useEffect(
        () => {
            getRequests()
        },
        [getRequests]
    )

    return (
        <div className="Requests">
            <div class="RequestsHeader">
                <h3>Requests</h3>
            </div>
            {
                requests.length === 0
                    ? <p>No requests to be shown.</p>
                    : requests.map((request, index) =>
                        <Request
                            changeRequestStatus={changeProfileRequestStatus}
                            loading={loading}
                            index={index + 1}
                            data={request}
                            key={request.googleId}
                        />
                    )
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        requests: state.requests.requests,
        loading: state.requests.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getRequests: () => dispatch(getRequests()),
        changeProfileRequestStatus: (data) => dispatch(changeProfileRequestStatus(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Requests)
