import React, { useState, useCallback, useEffect } from 'react'

import { connect } from 'react-redux'
import { getChatHistory } from '../../store/actions'

import './ChatWindow.css'

const ChatWindow = ({ getChatHistory, loading, error }) => {

    const [showChat, setShowChat] = useState(false)

    const toggleChat = useCallback(
        () => {
            setShowChat(prev => !prev)
        },
        [setShowChat]
    )

    useEffect(
        () => {
            if (showChat) {
                getChatHistory()
            }
        },
        [showChat, getChatHistory]
    )

    return (
        <div className="ChatWindow">
            <button onClick={toggleChat} className="ChatButton">Chat History</button>
            {
                showChat
                    ?
                    <div className="ChatHistory">
                        {
                            loading
                            ? <p>Loading...</p>
                            : null
                        }
                        {
                            error
                            ? <p>Something went wrong.</p>
                            : null
                        }
                    </div>
                    : null
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        chatHistory: state.chat.chatHistory,
        loading: state.chat.loading,
        error: state.chat.chatHistoryError
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getChatHistory: () => dispatch(getChatHistory())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow)
