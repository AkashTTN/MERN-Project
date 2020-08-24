import * as actionTypes from '../actions/actionTypes'

const initialState = {
    socialData: {},
    loading: false,
    error: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_SOCIAL_DATA: return { ...state, loading: true, error: false }
        case actionTypes.GET_USER_SOCIAL_DATA_SUCCESS: return getSocialDataSuccess(state, action.payload)
        case actionTypes.GET_USER_SOCIAL_DATA_FAILED: return getSocialDataFailed(state)
        default: return state
    }
}

export function getSocialDataSuccess(state, { socialData }) {
    return {
        ...state,
        loading: false,
        socialData
    }
}

export function getSocialDataFailed(state) {
    return {
        ...state,
        loading: false,
        error: true
    }
}

export default reducer
