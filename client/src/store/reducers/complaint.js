import * as actionTypes from '../actions/actionTypes'

const initialState = {
    complaints: null,
    error: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.CHANGE_COMPLAINT_STATUS: 
            return state

        case actionTypes.CHANGE_COMPLAINT_STATUS_SUCCESS:

            const updatedComplaints = state.complaints.map((complaint) => {
                if(complaint.complaintId === action.payload.complaintId) {
                    complaint.status = action.payload.complaintStatus
                    return complaint
                }
                return complaint
            })

            return {
                ...state,
                complaints: updatedComplaints
            }

        case actionTypes.GET_COMPLAINTS_SUCCESS:
            return {
                ...state,
                complaints: action.payload.complaints
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