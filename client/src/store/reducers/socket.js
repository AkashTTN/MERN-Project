import * as actionTypes from '../actions/actionTypes'

const initialState = {
    socket: null,
    error: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SOCKET_CONNECTION_ESTABLISHED: return { ...state, socket: action.payload.socket }
        case actionTypes.SOCKET_CONNECTION_FAILED: return { ...state, error: true }
        default: return state
    }
}

export default reducer