import * as actionTypes from '../actions/actionTypes'
import reset from '../utils/reset'

const initialState = {
    formConfigError: false,
    complaintSubmitted: false,
    postSubmitted: false,
    formConfig: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.SIGN_OUT_SUCCESS: return reset(initialState)

        case actionTypes.SUBMIT_COMPLAINT:
            return {
                ...state,
                complaintSubmitted: false
            }

        case actionTypes.SUBMIT_COMPLAINT_SUCCESS:
            return {
                ...state,
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