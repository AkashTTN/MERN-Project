import React, { useCallback } from 'react'
import moment from 'moment'

import LikeDislike from '../../LikeDislike/LikeDislike'
import Carousel from '../../UI/Carousel/Carousel'

import './Post.css'

function format(number) {
    if (number <= 9) return '0' + number
    return number
}

const Post = React.memo(({
    data,
    editPost,
    deletePost,
    likeStatus,
    dislikeStatus,
    likeCount,
    dislikeCount,
    onChange,
    mode
}) => {

    const date = new Date(data.createdAt)
    const day = format(date.getDate())
    const month = format(date.getMonth() + 1)

    const onChangeHandler = useCallback(
        (params) => {
            onChange({ ...params, buzzId: data.buzzId })
        },
        [onChange, data.buzzId]
    )

    return (
        <div className="Post flex-container">
            <div className="PostContainerOne">
                <p id="PostCreatedDay" >{day},</p>
                <p id="PostCreatedMonth" >{month}</p>
                {
                    (mode === 'myBuzz')
                        ? <span className="PostModificationOptions">
                            <i
                                onClick={() => deletePost({ postId: data.buzzId })}
                                className="deletePost fas fa-trash"></i>
                            <i onClick={editPost} className="editPost fas fa-edit"></i>
                        </span>
                        : null
                }
            </div>
            <div className="PostContainerTwo">
                <p id="PostUserData" >
                    {data.user.email}&nbsp;&middot;&nbsp;
                    {moment(data.createdAt).fromNow()}
                    {
                        data.category === 'Lost & Found'
                            ? <span>&nbsp;&middot;&nbsp;Posted under Lost & Found</span> : null
                    }
                </p>
                <p id="PostText" >{data.text}</p>
                {
                    data.imageUrl.length > 0
                    &&
                    <Carousel imageArray={data.imageUrl} />
                }
                {/* <Images imageUrl={data.imageUrl} type='buzz' buzzId={data.buzzId} /> */}
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