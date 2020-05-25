import React from 'react'

import './Post.css'

const Post = ({ data }) => {

    const date = new Date(data.createdAt)
    const day = date.getDate()
    const month = date.getMonth()

    return (
        <div className="Post flex-container">
            <div className="PostContainerOne">
                <p id="PostCreatedDay" >{day},</p>
                <p id="PostCreatedMonth" >{month}</p>
            </div>
            <div className="PostContainerTwo">
                <p id="PostUserEmail" >{data.user.email}</p>
                <p id="PostText" >{data.text}</p>
            </div>
        </div>
    )
}

export default Post