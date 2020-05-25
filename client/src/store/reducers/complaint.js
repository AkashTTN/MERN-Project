import * as actionTypes from '../actions/actionTypes'

const initialState = {
    complaints: null,
    error: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_COMPLAINTS_SUCCESS:
            return {
                ...state,
                complaints: action.payload
            }

        case actionTypes.GET_COMPLAINTS_FAILED:
            return {
                ...state,
                error: true
            }

        default: return state
    }
}

export default reducer