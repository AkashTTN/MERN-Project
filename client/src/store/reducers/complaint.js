import * as actionTypes from '../actions/actionTypes'
import reset from '../utils/reset'

const initialState = {
    complaints: [],
    error: false,
    loading: false,
    totalComplaints: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.SIGN_OUT_SUCCESS: return reset(initialState)

        case actionTypes.CHANGE_COMPLAINT_STATUS:
            return state

        case actionTypes.CHANGE_COMPLAINT_STATUS_SUCCESS:

            const updatedComplaints = state.complaints.map((complaint) => {
                if (complaint.complaintId === action.payload.complaintId) {
                    return {
                        ...complaint,
                        status: action.payload.complaintStatus
                    }
                }
                return complaint
            })

            return {
                ...state,
                complaints: updatedComplaints
            }

        case actionTypes.GET_COMPLAINTS:
            return {
                ...state,
                error: false,
                loading: true
            }

        case actionTypes.GET_COMPLAINTS_SUCCESS:
            return {
                ...state,
                complaints: action.payload.complaints,
                totalComplaints: action.payload.totalComplaints,
                loading: false
            }

        case actionTypes.GET_COMPLAINTS_FAILED:
            return {
                ...state,
                error: true,
                loading: false
            }

        default: return state
    }
}

export default reducer