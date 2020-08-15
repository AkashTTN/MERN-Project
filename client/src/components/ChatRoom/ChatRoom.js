import React, { useState, useCallback } from 'react'

import ChatMessage from '../ChatMessage/ChatMessage'

import './ChatRoom.css'

const ChatRoom = ({ participant = {}, chat = {}, toggelChatRoom, sendMessage }) => {

    const [message, setMessage] = useState('')
    const [sendMessageError, setSendMessageError] = useState('')

    const handleChange = (e) => {
        setSendMessageError('')
        const { value } = e.target
        setMessage(value)
    }

    const sendChatMessage = useCallback(
        (e, message, chatId) => {
            e.preventDefault()
            if (message.trim().length === 0) {
                setSendMessageError('Message cannot be empty')
            } else {
                sendMessage(message, chatId)
                setMessage('')
            }
        },
        [setMessage, sendMessage, setSendMessageError]
    )

    return (
        <div className="ChatRoom">
            <span className="ChatRoomHeader flex-container">
                <i onClick={toggelChatRoom} className="fas fa-arrow-left"></i>
                <p className="ChatRoomUserName">{participant.name}</p>
            </span>
            {
                chat.messages.map((message, index) => {
                    return <ChatMessage key={index} message={message} self={message.userId !== participant.googleId} />
                })
            }
            <form className="message-form flex-container"
                onSubmit={(e) => sendChatMessage(e, message, chat.chatId)}>
                <input
                    required onChange={handleChange} value={message} type="text" name="sendMessage"
                    className={sendMessageError ? "error SendMessage" : "SendMessage"}>
                </input>
                <button className="btn-primary" type="submit">Send</button>
            </form>
        </div>
    )
}

export default ChatRoom
