import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'
import { removeAuthData, getComplaints } from './'


export const submitForm = ({ data, type, editMode = false, id='' } = {}) => {
    return (dispatch, getState) => {

        const { token } = getState().authData
        let endpoint = ''

        if (type === 'Complaint') {
            endpoint = '/user/complaints'
            dispatch({ type: actionTypes.SUBMIT_COMPLAINT })
        } else {
            endpoint = editMode ? `/user/posts/${id}` : '/user/posts'
            dispatch({ type: actionTypes.SUBMIT_POST })
        }

        fetch(constants.SERVER_URL + endpoint, {
            method: editMode ? "PUT" : "POST",
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

                            dispatch({
                                type: actionTypes.SUBMIT_COMPLAINT_SUCCESS,
                                payload: { submittedComplaint: data }
                            })

                            dispatch(getComplaints({ mode: 'complaints' }))

                        } else {

                            dispatch({
                                type: actionTypes.SUBMIT_POST_SUCCESS,
                                payload: { submittedPost: data }
                            })

                            // dispatch(getPosts())

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

export const getFormConfig = () => {
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.GET_FORM_CONFIG })

        const { token } = getState().authData

        fetch(constants.SERVER_URL + '/user/form-config', {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 200) {
                    return dispatch({
                        type: actionTypes.GET_FORM_CONFIG_SUCCESS,
                        payload: { formConfig: response.data.formConfig }
                    })
                }
                throw new Error(response.message)
            })
            .catch(err => {
                console.error(err)
                dispatch({ type: actionTypes.GET_FORM_CONFIG_FAILED })
            })
    }
}