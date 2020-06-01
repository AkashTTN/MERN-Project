import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'
import { removeAuthData } from './'


export const submitForm = ({ data, type } = {}) => {
    return (dispatch, getState) => {
        const { token } = getState().authData
        let endpoint = ''
        if (type === 'Complaint') {
            endpoint = '/user/complaint'
            dispatch({ type: actionTypes.SUBMIT_COMPLAINT })
        } else {
            endpoint = '/user/post'
            dispatch({ type: actionTypes.SUBMIT_POST })
        }
        fetch(constants.SERVER_URL + endpoint, {
            method: "POST",
            body: data,
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
                        if (type === 'Complaint') {
                            dispatch({ type: actionTypes.SUBMIT_COMPLAINT_SUCCESS, payload: { submittedComplaint: data } })
                        } else {
                            dispatch({ type: actionTypes.SUBMIT_POST_SUCCESS, payload: { submittedPost: data } })
                        }
                    } else {
                        throw new Error(response.message)
                    }
                }
            })
            .catch(err => {
                console.log(err)
                if (type === 'Complaint') {
                    dispatch({ type: actionTypes.SUBMIT_COMPLAINT_FAILED })
                } else {
                    dispatch({ type: actionTypes.SUBMIT_POST_FAILED })
                }
            })
    }
}