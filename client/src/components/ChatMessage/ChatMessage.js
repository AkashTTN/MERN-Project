import React from 'react'
import moment from 'moment'

import './ChatMessage.css'

const ChatMessage = ({ message, self=true }) => {
    return (
        <div className={self ? "ChatMessage flex-container flex-end" : "ChatMessage"}>
            <div className="message">
                <p className="message-text">
                    {message.message}
                </p>
                <p className="message-time">
                    {moment(message.createdAt).format("hh:mm")}
                </p>
            </div>
        </div>
    )
}

export default ChatMessage
