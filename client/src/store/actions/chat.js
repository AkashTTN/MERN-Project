import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'

export const getChatHistory = () => {
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.GET_CHAT_HISTORY })

        const { token } = getState().authData

        fetch(constants.SERVER_URL + '/user/chat-history', {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.code === 200) {
                    dispatch({
                        type: actionTypes.GET_CHAT_HISTORY_SUCCESS,
                        payload: res.data.chatHistory
                    })
                } else {
                    throw new Error(res.message)
                }
            })
            .catch(error => {
                console.error(error)
                dispatch({ type: actionTypes.GET_CHAT_HISTORY_FAILED })
            })
    }
}