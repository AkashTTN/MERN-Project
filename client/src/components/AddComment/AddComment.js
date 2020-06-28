import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'

import { addComment } from '../../store/actions'

import './AddComment.css'

const AddComment = ({ buzzId, commentId, mode, addComment, error, email, name }) => {

    const [commentText, setCommentText] = useState('')

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault()
            mode === 'comment'
                ? addComment({ commentText, buzzId, email, name })
                : addComment({ commentText, buzzId, replyToId: commentId, email, name })
        },
        [addComment, buzzId, mode, commentId, commentText, email, name]
    )

    const onChange = useCallback(
        (e) => {
            setCommentText(e.target.value)
        },
        [setCommentText]
    )

    return (
        <div className="AddCommentBox mb-15">
            {error ? <p className="mb-15">Something went wrong. Comment could not be added.</p> : null}
            {
                mode === 'comment'
                    ? <p className="CommentBoxHeader mb-15" >Add a comment</p>
                    : null
            }
            <form onSubmit={onSubmit}>
                <textarea
                    className={mode === 'comment' ? "CommentText" : "CommentText mt-15"}
                    required
                    onChange={onChange}
                    value={commentText}
                    placeholder={mode === 'comment' ? 'Your comment...' : 'Your reply...'}></textarea>
                <button className="btn-primary" type="submit">Submit</button>
            </form>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        error: state.comment.error,
        email: state.authData.user.email,
        name: state.authData.user.name
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addComment: (data) => dispatch(addComment(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddComment)
