import * as actionTypes from '../actions/actionTypes'
import reset from '../utils/reset'

const initialState = {
    buzz: {},
    complaint: [],
    buzzError: false,
    complaintError: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        
        case actionTypes.SIGN_OUT_SUCCESS: return reset(initialState)

        case actionTypes.GET_BUZZ_IMAGES:
            return {
                ...state,
                buzzError: false
            }

        case actionTypes.GET_BUZZ_IMAGES_SUCCESS:
            return {
                ...state,
                buzz: { ...state.buzz, [action.payload.buzzId]: action.payload.images }
            }

        case actionTypes.GET_BUZZ_IMAGES_FAILED:
            return {
                ...state,
                buzzError: true
            }

        case actionTypes.GET_COMPLAINT_IMAGES:
            return {
                ...state,
                complaintError: false
            }

        case actionTypes.GET_COMPLAINT_IMAGES_SUCCESS:
            return {
                ...state,
                complaint: action.payload.images
            }

        case actionTypes.GET_COMPLAINT_IMAGES_FAILED:
            return {
                ...state,
                complaintError: true
            }

        default: return state
    }
}

export default reducer