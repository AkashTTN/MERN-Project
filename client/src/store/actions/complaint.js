import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'

export const getComplaints = () => {
    return (dispatch, getState) => {
        const { token } = getState().authData
        fetch(constants.SERVER_URL + '/user/complaints', {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 200) {
                    return dispatch({ type: actionTypes.GET_COMPLAINTS_SUCCESS, payload: { complaints: response.data } })
                }
                throw new Error(response.message)
            })
            .catch(err => {
                console.log(err)
                dispatch({ type: actionTypes.GET_POSTS_FAILED })
            })
    }
}
