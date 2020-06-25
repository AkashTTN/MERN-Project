import React, { useCallback, useState } from 'react'
import moment from 'moment'

import LikeDislike from '../../LikeDislike/LikeDislike'
import Carousel from '../../UI/Carousel/Carousel'
import Modal from "../../UI/Modal/Modal";
import Form from '../../UI/Form/Form'
import Comments from '../../Comments/Comments'

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
    const [showEditModal, setShowEditModal] = useState(false)
    const [showCommentsModal, setShowCommentsModal] = useState(false)

    const onChangeHandler = useCallback(
        (params) => {
            onChange({ ...params, buzzId: data.buzzId })
        },
        [onChange, data.buzzId]
    )

    return (
        <>
            {
                showCommentsModal
                    ? <Modal
                        heading='Comments'
                        closeModal={() => setShowCommentsModal(false)}>
                        <Comments buzzId={data.buzzId} />
                    </Modal>
                    : null
            }
            {
                showEditModal
                    ? <Modal
                        heading='Edit Buzz'
                        closeModal={() => setShowEditModal(false)}>
                        <Form
                            formType='Buzz'
                            editData={{
                                id: data.buzzId,
                                buzzText: data.text,
                                buzzCategory: data.category,
                                imageUrl: data.imageUrl
                            }}
                            editMode />
                    </Modal>
                    : null
            }
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
                                <i onClick={() => setShowEditModal(true)} className="editPost fas fa-edit"></i>
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
                    <div className="PostFooter mt-15 flex-container" >
                        <span onClick={() => setShowCommentsModal(true)}>
                            {data.comments.length} Comments
                        </span>
                        <LikeDislike
                            onChange={onChangeHandler}
                            likeStatus={likeStatus}
                            dislikeStatus={dislikeStatus}
                            likeCount={likeCount}
                            dislikeCount={dislikeCount}
                        />
                    </div>
                </div>
            </div>
        </>
    )
})

export default Post