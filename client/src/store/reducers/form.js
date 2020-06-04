import * as actionTypes from '../actions/actionTypes'

const initialState = {
    formConfigError: false,
    submittedComplaint: null,
    complaintSubmitted: false,
    submittedPost: null,
    postSubmitted: false,
    formConfig: null
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
                complaintSubmitted: false
            }

        case actionTypes.SUBMIT_POST:
            return {
                ...state,
                postSubmitted: false
            }

        case actionTypes.SUBMIT_POST_SUCCESS:
            return {
                ...state,
                submittedPost: action.payload.submittedPost,
                postSubmitted: true
            }

        case actionTypes.SUBMIT_POST_FAILED:
            return {
                ...state,
                postSubmitted: false
            }

        case actionTypes.GET_FORM_CONFIG:
            return {
                ...state,
                formConfigError: false
            }

        case actionTypes.GET_FORM_CONFIG_SUCCESS:
            return {
                ...state,
                formConfig: action.payload.formConfig,
                formConfigError: false
            }

        case actionTypes.GET_FORM_CONFIG_FAILED:
            return {
                ...state,
                formConfigError: true
            }

        default: return state
    }
}

export default reducer