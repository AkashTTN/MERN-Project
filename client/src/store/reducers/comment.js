import * as actionTypes from '../actions/actionTypes'

const initialState = {
    error: false,
    loading: false,
    comments: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_COMMENT: return { ...state, error: false, loading: true }
        case actionTypes.ADD_COMMENT_SUCCESS: return { ...state, loading: false }
        case actionTypes.ADD_COMMENT_FAILED: return setFailedStatus(state)
        case actionTypes.GET_COMMENTS: return { ...state, error: false, loading: true }
        case actionTypes.GET_COMMENTS_SUCCESS: return setComments(state, action)
        case actionTypes.GET_COMMENTS_FAILED: return setFailedStatus(state, action)
        default: return state
    }
}

const setFailedStatus = (state) => {
    return {
        ...state,
        loading: false,
        error: true
    }
}

const setComments = (state, action) => {
    return {
        ...state,
        loading: false,
        comments: action.payload.comments
    }
}

export default reducer