import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'
import { removeAuthData } from './'

export const getPosts = ({ limit = 5, skip = 0, category = '', mode } = {}) => {
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.GET_POSTS })

        const { token } = getState().authData
        const query = (mode === 'myBuzz')
            ? `/user/posts?category=${encodeURIComponent(category)}&limit=${limit}&skip=${skip}`
            : `/posts?category=${encodeURIComponent(category)}&limit=${limit}&skip=${skip}`

        fetch(constants.SERVER_URL + query, {
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
                            return dispatch({
                                type: actionTypes.GET_POSTS_SUCCESS,
                                payload: {
                                    posts: response.data.posts,
                                    totalPosts: response.data.totalPosts
                                }
                            })
                        }
                        dispatch({
                            type: actionTypes.GET_NEXT_POSTS_SUCCESS,
                            payload: {
                                posts: response.data.posts,
                                totalPosts: response.data.totalPosts
                            }
                        })
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
        const endpoint = `/user/posts/${buzzId}?type=${type}&status=${changedStatus}`
        fetch(constants.SERVER_URL + endpoint, {
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

export const deletePost = ({ postId }) => {

    
    return (dispatch, getState) => {

        if (!postId) {
            console.log('Post id required')
            return dispatch({ type: actionTypes.DELETE_POST_FAILED })
        }

        dispatch({ type: actionTypes.DELETE_POST })

        const { token } = getState().authData

        fetch(constants.SERVER_URL + `/user/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.code === 200) {
                    dispatch({ type: actionTypes.DELETE_POST_SUCCESS })
                } else {
                    throw new Error(response.message)
                }
            })
            .catch(err => {
                console.error(err.message || err)
                dispatch({ type: actionTypes.DELETE_POST_FAILED })
            })

    }

}