import * as actionTypes from '../actions/actionTypes'
import reset from '../utils/reset'

const initialState = {
    loading: false,
    formConfigError: false,
    complaintSubmitted: false,
    postSubmitted: false,
    formConfig: null,
    profileUpdated: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.SIGN_OUT_SUCCESS: return reset(initialState)

        case actionTypes.SUBMIT_COMPLAINT:
            return {
                ...state,
                loading: true,
                complaintSubmitted: false
            }

        case actionTypes.SUBMIT_COMPLAINT_SUCCESS:
            return {
                ...state,
                loading: false,
                complaintSubmitted: true
            }

        case actionTypes.SUBMIT_COMPLAINT_FAILED:
            return {
                ...state,
                loading: false,
                complaintSubmitted: false
            }

        case actionTypes.SUBMIT_POST:
            return {
                ...state,
                loading: true,
                postSubmitted: false
            }

        case actionTypes.SUBMIT_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                postSubmitted: true
            }

        case actionTypes.SUBMIT_POST_FAILED:
            return {
                ...state,
                loading: false,
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

        case actionTypes.UPDATE_PROFILE: return { ...state, loading: true }
        // Update profile success is also handled in auth reducer
        case actionTypes.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                profileUpdated: true
            }

        case actionTypes.UPDATE_PROFILE_FAILED: return {
            ...state,
            profileUpdated: false,
            loading: false
        }

        default: return state
    }
}

export default reducer