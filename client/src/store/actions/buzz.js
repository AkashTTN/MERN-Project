import * as actionTypes from './actionTypes'
import constants from '../../components/config/constants'

export const getPosts = ({ limit = 5, skip = 0 } = {}) => {
    return (dispatch, getState) => {
        const { token } = getState().authData
        fetch(constants.SERVER_URL + `/user/posts?limit=${limit}&skip=${skip}`, {
            headers: {
                'Authorization': 'bearer ' + token
            }
        })
            .then(res => res.json())
            .then(posts => {
                if (skip === 0) {
                    dispatch({ type: actionTypes.GET_POSTS_SUCCESS, payload: { posts: posts.data } })
                } else {
                    dispatch({ type: actionTypes.GET_NEXT_POSTS_SUCCESS, payload: { posts: posts.data } })
                }
            })
            .catch(err => dispatch({ type: actionTypes.GET_POSTS_FAILED }))
    }
}