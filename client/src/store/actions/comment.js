import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'
import { getPosts } from './'

export const getComments = (buzzId) => {
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.GET_COMMENTS })

        const { token } = getState().authData

        fetch(constants.SERVER_URL + `/posts/comments?buzzId=${buzzId}`, {
            headers: {
                'Authorization': 'bearer ' + token,
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 200) {
                    dispatch({
                        type: actionTypes.GET_COMMENTS_SUCCESS,
                        payload: { comments: response.data.comments }
                    })
                } else {
                    throw new Error(response.message)
                }
            })
            .catch(err => {
                console.error(err)
                dispatch({ type: actionTypes.GET_COMMENTS_FAILED })
            })
    }
}

export const addComment = ({ commentText = '', buzzId, replyToId, email, name }) => {

    return (dispatch, getState) => {

        const data = {
            commentText,
            replyToId, email, name
        }

        dispatch({ type: actionTypes.ADD_COMMENT })

        const { token } = getState().authData

        fetch(constants.SERVER_URL + `/posts/comments?buzzId=${buzzId}`, {
            method: replyToId ? 'PATCH' : 'POST',
            headers: {
                'Authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 200) {
                    dispatch({ type: actionTypes.ADD_COMMENT_SUCCESS })
                    dispatch(getPosts())
                } else {
                    throw new Error(response.message)
                }
            })
            .catch(err => {
                console.error(err)
                dispatch({ type: actionTypes.ADD_COMMENT_FAILED })
            })
    }
}