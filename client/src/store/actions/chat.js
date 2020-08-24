import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'

export const getChats = () => {
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.GET_CHAT_HISTORY })

        const { token } = getState().authData

        fetch(constants.SERVER_URL + '/user/chats', {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.code === 200) {
                    dispatch({
                        type: actionTypes.GET_CHAT_HISTORY_SUCCESS,
                        payload: { chats: res.data.chats }
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

export const deleteChat = (chatId) => {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.DELETE_CHAT })
        const { token } = getState().authData

        fetch(constants.SERVER_URL + `/user/chats/${chatId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.code === 200) {
                    dispatch({
                        type: actionTypes.DELETE_CHAT_SUCCESS,
                    })
                    dispatch(getChats())
                } else {
                    throw new Error(res.message)
                }
            })
            .catch(error => {
                console.error(error)
                dispatch({ type: actionTypes.DELETE_CHAT_FAILED })
            })
    }
}