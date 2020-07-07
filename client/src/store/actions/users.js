import * as actionTypes from '../actions/actionTypes'
import constants from '../../components/config/constants'

export function getUsers({ name }) {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.GET_USERS })

        const { token } = getState().authData

        fetch(constants.SERVER_URL + `/user/search-user?name=${name}`, {
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