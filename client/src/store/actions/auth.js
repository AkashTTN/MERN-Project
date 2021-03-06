import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'

export const setAuthData = () => {
    return dispatch => {
        // Check local storage for saved token
        let token = window.localStorage.getItem('token')
        if (token) {
            dispatch({
                type: actionTypes.SIGN_IN_SUCCESS,
                payload: {
                    token
                }
            })
        } else {
            // Check query string for token
            const urlParams = new URLSearchParams(window.location.search);
            token = urlParams.get('token')
            if (!token) {
                // Token not found
                dispatch({
                    type: actionTypes.SIGN_IN_FAILED
                })
                return
            } else {
                // Token found
                dispatch({
                    type: actionTypes.SIGN_IN_SUCCESS,
                    payload: {
                        token
                    }
                })
            }
        }
        dispatch({ type: actionTypes.SET_AUTH_DATA })

        fetch(constants.SERVER_URL + '/user/feed', {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(res => {
                dispatch({ type: actionTypes.SET_AUTH_DATA_SUCCESS, payload: { user: res.data.user } })
            })
            .catch(err => {
                dispatch({ type: actionTypes.SET_AUTH_DATA_FAILED })
            })
    }
}
