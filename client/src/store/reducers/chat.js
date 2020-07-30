import * as actionTypes from '../actions/actionTypes'

const initialState = {
    chats: [],
    chatsError: false,
    deleteChatError: false,
    loading: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_CHAT_HISTORY: return { ...state, loading: true, chatsError: false }
        case actionTypes.GET_CHAT_HISTORY_SUCCESS: return chatHistorySuccess(state, action.payload)
        case actionTypes.GET_CHAT_HISTORY_FAILED: return { ...state, loading: false, chatsError: true }
        case actionTypes.DELETE_CHAT: return { ...state, deleteChatError: false }
        case actionTypes.DELETE_CHAT_SUCCESS: return state
        case actionTypes.DELETE_CHAT_FAILED: return { ...state, deleteChatError: true }
        default: return state
    }
}

const chatHistorySuccess = (state, payload) => {
    return {
        ...state,
        loading: false,
        chats: payload.chats
    }
}

export default reducer