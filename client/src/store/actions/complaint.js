import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'
import { removeAuthData } from './'

export const getComplaints = ({ limit = 5, skip = 0, mode, statusFilter='' } = {}) => {
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.GET_COMPLAINTS })

        const { token, user: { googleId } } = getState().authData

        const endpoint = mode === 'resolved'
            ? `/user/complaints?statusFilter=${statusFilter}&limit=${limit}&skip=${skip}`
            : `/user/complaints?statusFilter=${statusFilter}&userId=${googleId}&limit=${limit}&skip=${skip}`

        fetch(constants.SERVER_URL + endpoint, {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 403) {
                    dispatch(removeAuthData())
                    throw new Error(response.message)
                } else {
                    if (response.code === 200) {
                        return dispatch({
                            type: actionTypes.GET_COMPLAINTS_SUCCESS,
                            payload: {
                                complaints: response.data.complaints,
                                totalComplaints: response.data.totalComplaints
                            }
                        })
                    }
                    throw new Error(response.message)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch({ type: actionTypes.GET_COMPLAINTS_FAILED })
            })
    }
}

export const changeComplaintStatus = ({ complaintId, status }) => {
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.CHANGE_COMPLAINT_STATUS })

        const { token } = getState().authData
        const endpoint = `/user/complaints/${complaintId}?status=${status}`

        fetch(constants.SERVER_URL + endpoint, {
            method: 'PATCH',
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 200) {
                    return dispatch({
                        type: actionTypes.CHANGE_COMPLAINT_STATUS_SUCCESS,
                        payload: {
                            complaintId,
                            complaintStatus: response.data.complaint.updatedStatus
                        }
                    })
                }
                throw new Error(response.message)
            })
            .catch(err => {
                console.log(err)
                dispatch({ type: actionTypes.CHANGE_COMPLAINT_STATUS_FAILED })
            })
    }
}

export const updateComplaint = ({ complaintId, concernText }) => {
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.UPDATE_COMPLAINT })

        const { token } = getState().authData
        const endpoint = `/user/complaints/${complaintId}`
        fetch(constants.SERVER_URL + endpoint, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'bearer ' + token
            },
            body: JSON.stringify({ concernText })
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 200) {
                    return dispatch({
                        type: actionTypes.UPDATE_COMPLAINT_SUCCESS,
                        payload: {
                            complaint: response.data.updatedComplaint
                        }
                    })
                }
                throw new Error(response.message)
            })
            .catch(err => {
                console.log(err)
                dispatch({ type: actionTypes.UPDATE_COMPLAINT_FAILED })
            })

    }
}

