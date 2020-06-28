import React, { useCallback, useState } from 'react'

import AddComment from '../../AddComment/AddComment'
import moment from 'moment'
import Replies from '../../Replies/Replies'

import './Comment.css'

const Comment = ({ data }) => {

    const [isReplying, setIsReplying] = useState(false)
    const [showReplies, setShowReplies] = useState(false)

    const onClick = useCallback(
        () => {
            setIsReplying(prevValue => !prevValue)
        },
        [setIsReplying]
    )

    return (
        <div className="Comment mt-15">
            <p className="CommentUserData">{data.user.name}&nbsp;&middot;&nbsp;{moment(data.createdAt).fromNow()}</p>
            <p className="CommentData">{data.text}</p>
            {
                isReplying
                    ? <AddComment mode='reply' buzzId={data.buzzId} commentId={data.commentId} />
                    : null
            }
            <button onClick={onClick} className="ReplyButton">
                {
                    isReplying
                        ? null
                        : <i class="fas fa-reply">&nbsp;</i>
                }
                {isReplying ? 'Cancel' : 'Reply'}
            </button>
            <span
                onClick={() => setShowReplies(prevValue => !prevValue)}
                className="ReplyCount ReplyButton">
                &nbsp;&middot;&nbsp;{`${showReplies ? 'Hide ' : '' + data.replies.length} Replies`}
            </span>
            {
                showReplies
                ? <Replies data={data.replies} />
                : null
            }
        </div>
    )
}

export default Comment
