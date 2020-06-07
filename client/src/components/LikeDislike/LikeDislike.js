import React from 'react'

import classes from './LikeDislike.module.css'

const LikeDislike = ({
    likeCount,
    dislikeCount,
    onChange,
    likeStatus,
    dislikeStatus
}) => {
    return (
        <div className={[classes.LikeDislike, 'flex-container'].join(' ')}>
            <p>{likeCount}</p>&nbsp;
            <i
                className={["fas fa-thumbs-up", classes.HoverCursor, `${likeStatus ? classes.Active : classes.Inactive}`].join(' ')}
                onClick={() => onChange({ type:'like', changedStatus:!likeStatus })}>
            </i>&nbsp;&nbsp;&nbsp;
            <p>{dislikeCount}</p>&nbsp;
            <i
                className={["fas fa-thumbs-down", classes.HoverCursor, `${dislikeStatus ? classes.Active : classes.Inactive}`].join(' ')}
                onClick={() => onChange({ type:'dislike', changedStatus:!dislikeStatus })}>
            </i>
        </div>
    )
}

export default LikeDislike