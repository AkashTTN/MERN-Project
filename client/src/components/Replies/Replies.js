import React from 'react'

import Reply from './Reply/Reply'

import './Replies.css'

const Replies = ({ data }) => {
    return (
        <div className="Replies">
            {
                data.length === 0
                ? <p>No replies to show.</p>
                : data.map(reply => {
                    return <Reply reply={reply} />
                })
            }
        </div>
    )
}

export default Replies
