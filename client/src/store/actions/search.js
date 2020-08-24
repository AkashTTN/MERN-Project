import * as actionTypes from '../actions/actionTypes'
import constants from '../../components/config/constants'

export function getUsers({ name }) {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.GET_USERS })

        const { token } = getState().authData

        fetch(constants.SERVER_URL + `/user?name=${name}`, {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.code === 200) {
                    dispatch({
                        type: actionTypes.GET_USERS_SUCCESS,
                        payload: { users: res.data.users }
                    })
                } else {
                    throw new Error(res.message)
                }
            })
            .catch(err => {
                console.error(err)
                dispatch({ type: actionTypes.GET_USERS_FAILED })
            })
    }
}

export function setProfileUserData(userToFetch) {
    return (dispatch, getState) => {
        const {token} = getState().authData
        dispatch({ type: actionTypes.SELECT_USER })
        dispatch({ type: actionTypes.GET_PROFILE_USER_INFO })

        fetch(constants.SERVER_URL + `/user?id=${userToFetch}`, {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.code === 200) {
                    dispatch({
                        type: actionTypes.GET_PROFILE_USER_INFO_SUCCESS,
                        payload: { user: res.data.user }
                    })
                } else {
                    throw new Error(res.message)
                }
            })
            .catch(err => {
                console.error(err)
                dispatch({ type: actionTypes.GET_PROFILE_USER_INFO_FAILED })
            })

    }
}