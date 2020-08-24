import React, { useState, useCallback, useEffect } from 'react'

import { connect } from 'react-redux'
import { getChats, initialiseSocket, deleteChat } from '../../store/actions'
import ChatRoom from '../ChatRoom/ChatRoom'

import './ChatWindow.css'
import CustomAvatar from '../UI/CustomAvatar/CustomAvatar'

const ChatWindow = ({
    getChats, loading, error, initialChats, socket,
    initialiseSocket, currentUserId, deleteChat
}) => {

    const [showChat, setShowChat] = useState(false)
    const [showChatRoom, setShowChatRoom] = useState(false)
    const [chatRoomUser, setChatRoomUser] = useState({})
    const [chatRoomChat, setChatRoomChat] = useState({})
    const [newMessage, setNewMessage] = useState(false)
    const [chats, setChats] = useState(initialChats)

    useEffect(() => {
        setChats(initialChats)
    }, [setChats, initialChats])

    useEffect(
        () => {
            if (socket) {
                socket.off('new-message').on('new-message', (data) => {
                    setNewMessage(true)
                    console.log('new message', data)
                    const newChats = chats.map(chat => {
                        if (chat.chatId === data.chatId) {
                            const newChat = {
                                ...chat,
                                messages: [...chat.messages, data]
                            }
                            if (showChatRoom) {
                                setChatRoomChat(newChat)
                            }
                            return newChat
                        }
                        return chat
                    })
                    setChats(newChats)
                })
                socket.off('message-not-saved').on('message-not-saved', (error) => {
                    console.log('message not saved', error)
                })
                socket.off('chat-room-created').on('chat-room-created', (roomInfo) => {
                    setShowChat(true)
                    if (roomInfo.new === true) {
                        getChats()
                        console.log('new room created', roomInfo.room)
                    }
                })
            }
        },
        [socket, setShowChat, setNewMessage, setChats, chats,
            setChatRoomChat, getChats, showChatRoom]
    )

    const toggleChat = useCallback(
        () => {
            setShowChat(prev => !prev)
        },
        [setShowChat]
    )

    const toggelChatRoom = useCallback(
        (participant, chat) => {
            if (!showChatRoom) {
                setChatRoomUser(participant)
                setChatRoomChat(chat)
            }
            setShowChatRoom((prev) => !prev)
        }, [setShowChatRoom, setChatRoomUser, showChatRoom]
    )

    const joinChat = useCallback(
        (chat) => {
            socket.emit('joinChat', { chatId: chat.chatId })
        }, [socket]
    )

    useEffect(
        () => {
            if (showChat) {
                if (!socket) {
                    initialiseSocket()
                }
                getChats()
            }
        },
        [showChat, getChats, socket, initialiseSocket]
    )

    const sendMessage = useCallback(
        (message, chatId) => {
            console.log('message sent')
            socket.emit('message', { message, chatId, userId: currentUserId })
        },
        [socket, currentUserId]
    )

    let chatWindowContent = null

    if (showChatRoom) {
        chatWindowContent = <ChatRoom
            participant={chatRoomUser}
            sendMessage={sendMessage}
            chat={chatRoomChat}
            toggelChatRoom={toggelChatRoom} />
    } else {
        chatWindowContent = chats.length !== 0
            && chats.map(chat => {
                const user = chat.participants.find(participant => {
                    return participant.googleId !== currentUserId
                })
                return <div
                    key={chat.chatId}
                    onClick={() => {
                        toggelChatRoom(user, chat)
                        joinChat(chat)
                    }}
                    className="chat-room flex-container">
                    <CustomAvatar src={user.profilePicture} alt={user.name} />
                    <span className="participant-name" >{user.name}</span>
                    <i
                        onClick={(e) => { e.stopPropagation(); deleteChat(chat.chatId) }}
                        className="delete-chat fas fa-trash"></i>
                </div>
            })
    }

    return (
        <div className="ChatWindow">
            <button onClick={toggleChat} className="ChatButton">
                Chats&nbsp;&nbsp;&nbsp;
                {
                    newMessage && !showChat
                    && <i className="fas fa-exclamation-circle"></i>
                }
            </button>
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
                        {
                            !loading && !error && chats.length === 0
                            && <p>No chats to show.</p>
                        }
                        {
                            !loading && !error && chatWindowContent
                        }
                    </div>
                    : null
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        initialChats: state.chat.chats,
        loading: state.chat.loading,
        error: state.chat.chatsError,
        socket: state.socket.socket,
        socketError: state.socket.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getChats: () => dispatch(getChats()),
        deleteChat: (chatId) => dispatch(deleteChat(chatId)),
        initialiseSocket: () => dispatch(initialiseSocket())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow)
