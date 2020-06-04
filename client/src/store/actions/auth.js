import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'


export const removeAuthData = () => {
    // remove token from local storage
    window.localStorage.removeItem('token')

    // clear data from redux store
    return {
        type: actionTypes.SIGN_OUT_SUCCESS
    }
}

export const setAuthData = () => {
    return dispatch => {
        dispatch({ type: actionTypes.SET_AUTH_DATA })
        // Check local storage for saved token
        let token = window.localStorage.getItem('token')
        if (token) {
            window.localStorage.setItem('token', token)
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
                window.localStorage.setItem('token', token)
                dispatch({
                    type: actionTypes.SIGN_IN_SUCCESS,
                    payload: {
                        token
                    }
                })
            }
        }

        fetch(constants.SERVER_URL + '/user', {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(res => {
                if(res.code === 403) {
                    return dispatch(removeAuthData())
                }
                dispatch({ type: actionTypes.SET_AUTH_DATA_SUCCESS, payload: { user: res.data.user } })
            })
            .catch(err => {
                dispatch({ type: actionTypes.SET_AUTH_DATA_FAILED })
            })
    }
}
