import React, { useCallback } from 'react'
import moment from 'moment'

import Images from '../../UI/Images/Images'
import LikeDislike from '../../LikeDislike/LikeDislike'

import './Post.css'

const Post = React.memo(({ 
    data, 
    likeStatus, 
    dislikeStatus, 
    likeCount, 
    dislikeCount, 
    onChange 
}) => {

    const date = new Date(data.createdAt)
    const day = date.getDate()
    const month = date.getMonth() + 1

    const onChangeHandler = useCallback(
        (params) => {
            onChange({...params, buzzId: data.buzzId})
        },
        [onChange, data.buzzId]
    )

    return (
        <div className="Post flex-container">
            <div className="PostContainerOne">
                <p id="PostCreatedDay" >{day},</p>
                <p id="PostCreatedMonth" >{month}</p>
            </div>
            <div className="PostContainerTwo">
                <p id="PostUserEmail" >
                    {data.user.email}&nbsp;&middot;&nbsp;
                    {moment(data.createdAt).fromNow()}
                </p>
                <p id="PostText" >{data.text}</p>
                <Images imageUrl={data.imageUrl} type='buzz' buzzId={data.buzzId} />
                <LikeDislike
                    onChange={onChangeHandler}
                    likeStatus={likeStatus}
                    dislikeStatus={dislikeStatus}
                    likeCount={likeCount}
                    dislikeCount={dislikeCount}
                />
            </div>
        </div>
    )
})

export default Post