import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'
import { removeAuthData } from './'

export const getPosts = ({ limit = 5, skip = 0 } = {}) => {
    return (dispatch, getState) => {

        const { token } = getState().authData
        fetch(constants.SERVER_URL + `/user/posts?limit=${limit}&skip=${skip}`, {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 403) {
                    dispatch(removeAuthData())
                    throw new Error(response.message)
                } else {
                    if (response.code === 200) {
                        if (skip === 0) {
                            dispatch({
                                type: actionTypes.GET_POSTS_SUCCESS,
                                payload: { posts: response.data }
                            })
                        } else {
                            dispatch({ 
                                type: actionTypes.GET_NEXT_POSTS_SUCCESS, 
                                payload: { posts: response.data } 
                            })
                        }
                    } else {
                        throw new Error(response.message)
                    }
                }

            })
            .catch(err => {
                console.log(err)
                dispatch({ type: actionTypes.GET_POSTS_FAILED })
            })
    }
}

export const changeLikeDislike = ({ type, changedStatus, buzzId }) => {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.CHANGE_LIKE_DISLIKE })

        const { token } = getState().authData

        fetch(constants.SERVER_URL + `/user/posts/${buzzId}?type=${type}&status=${changedStatus}`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 403) {
                    dispatch(removeAuthData())
                    throw new Error(response.message)
                } else {
                    if (response.code === 200) {
                        dispatch({
                            type: actionTypes.CHANGE_LIKE_DISLIKE_SUCCESS,
                            payload: { type, updatedPost: response.data.updatedPost }
                        })
                    } else {
                        throw new Error(response.message)
                    }
                }

            })
            .catch(err => {
                console.log(err)
                dispatch({ type: actionTypes.CHANGE_LIKE_DISLIKE_FAILED })
            })
    }
}