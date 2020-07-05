import * as actionTypes from '../actions/actionTypes'

const initialState = {
    requests: [],
    loading: false,
    error: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SIGN_OUT_SUCCESS: return initialState
        case actionTypes.GET_REQUESTS: return { ...state, error: false, loading: true }
        case actionTypes.GET_REQUESTS_SUCCESS: return getRequestsSuccess(state, action.payload)
        case actionTypes.GET_REQUESTS_FAILED: return getRequestsFailed(state)
        case actionTypes.CHANGE_PROFILE_REQUEST_STATUS: return { ...state, error: false, loading: true }
        case actionTypes.CHANGE_PROFILE_REQUEST_STATUS_SUCCESS:
            return { ...state, loading: false }
        case actionTypes.CHANGE_PROFILE_REQUEST_STATUS_FAILED:
            return {
                ...state,
                loading: false,
                error: true
            }

        default: return state
    }
}

const getRequestsFailed = state => {
    return {
        ...state,
        loading: false,
        error: true
    }
}

const getRequestsSuccess = (state, payload) => {
    return {
        ...state,
        requests: payload.requests,
        loading: false
    }
}

export default reducer