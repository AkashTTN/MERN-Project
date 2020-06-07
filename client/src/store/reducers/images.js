import * as actionTypes from '../actions/actionTypes'

const initialState = {
    buzz: {},
    complaint: [],
    buzzError: false,
    complaintError: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
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