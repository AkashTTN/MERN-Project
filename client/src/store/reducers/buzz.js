import * as actionTypes from '../actions/actionTypes'

const initialState = {
    posts: null,
    error: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_POSTS:
            return {
                ...state,
                error: false
            }

        case actionTypes.GET_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.payload.posts
            }

        case actionTypes.GET_POSTS_FAILED:
            return {
                ...state,
                error: true
            }

        case actionTypes.GET_NEXT_POSTS_SUCCESS:
            return {
                ...state,
                posts: state.posts.concat(action.payload.posts),
                error: false
            }

        case actionTypes.GET_NEXT_POSTS_FAILED:
            return {
                ...state,
                error: true
            }

        case actionTypes.SUBMIT_POST:
            return {
                ...state,
                error: false
            }

        default:
            return state
    }
}

export default reducer