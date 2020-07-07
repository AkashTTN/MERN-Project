import * as actionTypes from '../actions/actionTypes'

const initialState = {
    chatHistory: [],
    chatHistoryError: false,
    loading: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_CHAT_HISTORY: return initialState
        case actionTypes.GET_CHAT_HISTORY_SUCCESS: return chatHistorySuccess(state, action.payload)
        case actionTypes.GET_CHAT_HISTORY_FAILED: return { ...state, loading: false, chatHistoryError: true }
        default: return state
    }
}

const chatHistorySuccess = (state, payload) => {
    return {
        ...state,
        loading: false,
        chatHistory: payload.chatHistory
    }
}

export default reducer