import React from 'react'

import moment from 'moment'

import './Comment.css'

const Comment = ({ data }) => {
    return (
        <div className="Comment mt-15">
            <p className="CommentUserData">{data.user.name}&nbsp;&middot;&nbsp;{moment(data.createdAt).fromNow()}</p>
            <p className="CommentData">{data.text}</p>
        </div>
    )
}

export default Comment
