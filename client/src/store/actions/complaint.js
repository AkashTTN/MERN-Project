import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'
import { removeAuthData } from './'

export const getComplaints = ({ limit = 10, skip = 0 } = {}) => {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.GET_COMPLAINTS })
        const { token } = getState().authData
        fetch(constants.SERVER_URL + `/user/complaints?limit=${limit}&skip=${skip}`, {
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
        fetch(constants.SERVER_URL + `/user/complaints/${complaintId}?status=${status}`, {
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

