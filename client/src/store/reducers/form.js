import * as actionTypes from '../actions/actionTypes'

const initialState = {
    error: false,
    submittedComplaint: null,
    complaintSubmitted: false,
    submittedPost: null,
    postSubmitted: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SUBMIT_COMPLAINT:
            return {
                ...state,
                complaintSubmitted: false
            }
            
        case actionTypes.SUBMIT_COMPLAINT_SUCCESS:
            return {
                ...state,
                submittedComplaint: action.payload,
                complaintSubmitted: true
            }

        case actionTypes.SUBMIT_COMPLAINT_FAILED:
            return {
                ...state,
                error: true,
                complaintSubmitted: false
            }
        case actionTypes.SUBMIT_POST_SUCCESS:
            return {
                ...state,
                error: false,
                submittedPost: action.payload.submittedPost,
                postSubmitted: true
            }

        case actionTypes.SUBMIT_POST_FAILED:
            return {
                ...state,
                error: true,
                postSubmitted: false
            }
        default: return state
    }
}

export default reducer