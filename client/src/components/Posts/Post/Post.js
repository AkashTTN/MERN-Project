import React from 'react'

import Images from '../../UI/Images/Images'

import './Post.css'

const Post = ({ data }) => {

    const date = new Date(data.createdAt)
    const day = date.getDate()
    const month = date.getMonth() + 1

    return (
        <div className="Post flex-container">
            <div className="PostContainerOne">
                <p id="PostCreatedDay" >{day},</p>
                <p id="PostCreatedMonth" >{month}</p>
            </div>
            <div className="PostContainerTwo">
                <p id="PostUserEmail" >{data.user.email}</p>
                <p id="PostText" >{data.text}</p>
                <Images imageUrl={data.imageUrl} type='buzz' buzzId={data.buzzId} />
            </div>
        </div>
    )
}

export default Post