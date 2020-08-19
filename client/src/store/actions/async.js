// test file
// should contain all async actions

import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'

export const getUserSocialData = (id) => {
    return (dispatch, getState) => {

        const { token } = getState().authData

        dispatch({ type: actionTypes.GET_USER_SOCIAL_DATA })
        fetch(constants.SERVER_URL + `/user/social-data?id=${id}`, {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.code === 200) {
                    dispatch({
                        type: actionTypes.GET_USER_SOCIAL_DATA_SUCCESS,
                        payload: { socialData: res.data.socialData }
                    })
                } else {
                    throw new Error(res.message)
                }
            })
            .catch(err => {
                console.error(err)
                dispatch({ type: actionTypes.GET_USER_SOCIAL_DATA_FAILED })
            })
    }
}