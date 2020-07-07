import * as actionTypes from '../actions/actionTypes'

const initialState = {
    users: [],
    error: false,
    loading: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_USERS: return { ...state, loading: true, error: false }
        case actionTypes.GET_USERS_SUCCESS: return getUsersSuccess(state, action.payload)
        case actionTypes.GET_USERS_FAILED: return { ...state, loading: false, error: true }
        default: return state
    }
}

function getUsersSuccess(state, payload) {
    return {
        ...state,
        users: payload.users,
        loading: false
    }
}

export default reducer