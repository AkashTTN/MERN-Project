import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import Comment from './Comment/Comment'
import AddComment from '../AddComment/AddComment'
import { getComments } from '../../store/actions'
import Spinner from '../UI/Spinner/Spinner'

import './Comments.css'

const Comments = ({ loading, buzzId, comments, error, getComments }) => {

    let commentsArray

    useEffect(() => {
        getComments(buzzId)
    }, [getComments, buzzId])

    if (error) {
        commentsArray = <p>Something went wrong.</p>
    } else {
        if (loading) {
            commentsArray = <Spinner isMarginRequired />
        } else {
            if (comments.length === 0) {
                commentsArray = <p>No comments to show.</p>
            } else {
                commentsArray = comments.map(comment => {
                    return <Comment key={comment.commentId} data={comment} />
                })
            }
        }
    }

    return (
        <div className="Comments">
            <AddComment mode='comment' buzzId={buzzId} className="mb-15" />
            {commentsArray}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        comments: state.comment.comments,
        loading: state.comment.loading,
        error: state.comment.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getComments: (data) => dispatch(getComments(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)
