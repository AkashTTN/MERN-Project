import * as actionTypes from '../actions/actionTypes'

const initialState = {
    token: null,
    error: false,
    user: null
}

const reducer = (state=initialState, action) => {
    switch(action.type) {

        case actionTypes.SIGN_IN_SUCCESS:
            return {
                ...state,
                token: action.payload.token
            }

        case actionTypes.SIGN_IN_FAILED:
            return {
                token: null,
                error: true,
                user: null
            }

        case actionTypes.SET_AUTH_DATA:
            return {
                ...state,
                error: false
            }

        case actionTypes.SET_AUTH_DATA_SUCCESS:
            return {
                ...state,
                user: action.payload.user
            }

        case actionTypes.SET_AUTH_DATA_FAILED:
            return {
                ...state,
                error: true
            }

        default: return state
    }
}

export default reducer