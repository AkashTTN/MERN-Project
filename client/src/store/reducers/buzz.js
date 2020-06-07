import * as actionTypes from '../actions/actionTypes'

const initialState = {
    posts: null,
    error: false,
    changeLikeDislikeError: false
}

const reset = () => ({ ...initialState })

const changeLikeDislike = (state, action) => {

    const updatedPosts = state.posts.map(post => {
        if (post.buzzId === action.payload.updatedPost.buzzId) {
            return {
                ...post,
                likedBy: action.payload.updatedPost.likedBy,
                dislikedBy: action.payload.updatedPost.dislikedBy,
                dislikeCount: action.payload.updatedPost.dislikeCount,
                likeCount: action.payload.updatedPost.likeCount
            }
        } else {
            return post
        }

    })

    return {
        ...state,
        posts: updatedPosts
    }

}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.SIGN_OUT_SUCCESS: reset()

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

        case actionTypes.CHANGE_LIKE_DISLIKE:
            return {
                ...state,
                changeLikeDislikeError: false
            }

        case actionTypes.CHANGE_LIKE_DISLIKE_SUCCESS:
            const updatedPosts = state.posts.map(post => {
                if (post.buzzId === action.payload.updatedPost.buzzId) {
                    return {
                        ...post,
                        likedBy: action.payload.updatedPost.likedBy,
                        dislikedBy: action.payload.updatedPost.dislikedBy,
                        dislikeCount: action.payload.updatedPost.dislikeCount,
                        likeCount: action.payload.updatedPost.likeCount
                    }
                } else {
                    return post
                }

            })

            return {
                ...state,
                posts: updatedPosts
            }

        case actionTypes.CHANGE_LIKE_DISLIKE_FAILED:
            return {
                ...state,
                changeLikeDislikeError: true
            }

        default:
            return state
    }
}

export default reducer