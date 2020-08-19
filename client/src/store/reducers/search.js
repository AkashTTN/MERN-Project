import * as actionTypes from '../actions/actionTypes'

const initialState = {
    users: [],
    error: false,
    loading: false,
    selectedUser: false,
    selectedUserError: false,
    selectedUserLoading: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_USERS: return { ...state, loading: true, error: false }
        case actionTypes.GET_USERS_SUCCESS: return getUsersSuccess(state, action.payload)
        case actionTypes.GET_USERS_FAILED: return { ...state, loading: false, error: true }
        case actionTypes.SELECT_USER: return state
        case actionTypes.GET_PROFILE_USER_INFO: return { ...state, selectedUserError: false, selectedUserLoading: true }
        case actionTypes.GET_PROFILE_USER_INFO_FAILED: return getProfileUserInfoFailed(state)
        case actionTypes.GET_PROFILE_USER_INFO_SUCCESS: return getProfileUserInfoSuccess(state, action.payload)
        case actionTypes.UPDATE_PROFILE_SUCCESS: return { ...state, selectedUser: action.payload.user }
        default: return state
    }
}

function getProfileUserInfoSuccess(state, { user }) {
    return {
        ...state,
        selectedUserLoading: false,
        selectedUser: user
    }
}

function getProfileUserInfoFailed(state) {
    return {
        ...state,
        selectedUserLoading: false,
        selectedUserError: true
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