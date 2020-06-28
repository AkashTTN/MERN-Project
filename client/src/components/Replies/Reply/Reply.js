import React from 'react'

import './Reply.css'

const Reply = ({reply}) => {
    return (
        <div className="Reply">
            <p className="CommentUserData">{reply.user.name}</p>
            <p className="CommentData">{reply.text}</p>
        </div>
    )
}

export default Reply
