import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import MaterialRequest from '../Material-UI/Request/Request'
import { getRequests, changeProfileRequestStatus } from '../../store/actions'

import './Requests.css'
import Spinner from '../UI/Spinner/Spinner'

const Requests = ({ loading, requests, getRequests, changeProfileRequestStatus }) => {

    useEffect(
        () => {
            getRequests()
        },
        [getRequests]
    )

    let requestsContent = null

    if (!loading) {
        if (requests.length === 0) {
            requestsContent = <p>No requests to be shown.</p>
        } else {
            requestsContent = requests.map((request, index) =>
                <MaterialRequest
                    changeRequestStatus={changeProfileRequestStatus}
                    index={index + 1}
                    data={request}
                    key={request.googleId}
                />
            )
        }
    }

    return (
        <div className="Requests">
            <div class="RequestsHeader">
                <h3>Requests</h3>
            </div>
            {
                loading && <Spinner isMarginRequired={true} />
            }
            {requestsContent}
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
