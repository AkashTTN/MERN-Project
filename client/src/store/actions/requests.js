import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'

export const getRequests = () => {

    return (dispatch, getState) => {

        dispatch({ type: actionTypes.GET_REQUESTS })

        const { token } = getState().authData
        const endpoint = `/admin/requests`

        fetch(constants.SERVER_URL + endpoint, {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.code === 200) {
                    dispatch({
                        type: actionTypes.GET_REQUESTS_SUCCESS,
                        payload: { requests: res.data.users }
                    })
                } else {
                    throw new Error(res.message)
                }
            })
            .catch(err => {
                console.error(err)
                dispatch({ type: actionTypes.GET_REQUESTS_FAILED })
            })

    }
}

export const changeProfileRequestStatus = ({ status }) => {

    return (dispatch, getState) => {

        dispatch({ type: actionTypes.CHANGE_PROFILE_REQUEST_STATUS })

        const { token } = getState().authData
        const endpoint = `/admin/requests?updateProfileUpdateStatus=${status}`

        fetch(constants.SERVER_URL + endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.code === 200) {
                    dispatch({
                        type: actionTypes.CHANGE_PROFILE_REQUEST_STATUS_SUCCESS,
                    })
                    dispatch(getRequests())
                } else {
                    throw new Error(res.message)
                }
            })
            .catch(err => {
                console.error(err)
                dispatch({ type: actionTypes.CHANGE_PROFILE_REQUEST_STATUS_FAILED })
            })

    }
}