import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { getPosts, changeLikeDislike } from '../../store/actions'

import Post from './Post/Post'

import './Posts.css'

const Posts = ({
    posts,
    getPosts,
    postSubmitted,
    changeLikeDislike,
    userId
}) => {

    const postsDiv = useRef(null)

    let postsArray = null
    let limit = 5
    let skip = 0

    // useEffect(
    //     () => {
    //         // Detect when scrolled to bottom.
    //         postsDiv.current.addEventListener("scroll", () => {
    //             if (
    //                 postsDiv.current.scrollTop + postsDiv.current.clientHeight >=
    //                 postsDiv.current.scrollHeight
    //             ) {
    //                 getPosts({ limit, skip });
    //             }
    //         });
    //     },
    //     [postsDiv, getPosts, limit, skip]
    // )

    useEffect(
        () => {
            if (postSubmitted) {
                getPosts({ limit, skip: 0 })
            }
        },
        [getPosts, postSubmitted, limit, skip]
    )

    useEffect(
        () => {
            getPosts({ limit, skip })
        },
        [getPosts, limit, skip]
    )

    if (posts) {
        if (posts.length === 0) {
            postsArray = <p>No posts yet.</p>
        } else {
            skip = posts.length
            postsArray = posts.map((post, index) => {

                const likeStatus = post.likedBy.includes(userId)
                const dislikeStatus = post.dislikedBy.includes(userId)

                return (
                    <Post
                        key={index}
                        data={post}
                        likeStatus={likeStatus}
                        dislikeStatus={dislikeStatus}
                        onChange={changeLikeDislike}
                        likeCount={post.likedBy.length}
                        dislikeCount={post.dislikedBy.length}
                    />
                )
            })
        }
    }

    return (
        <div className="Posts" ref={postsDiv}>
            <h3 className="PostsHeader" ><i className="fas fa-at"></i>&nbsp;&nbsp;Recent Buzz</h3>
            {postsArray}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        posts: state.buzz.posts,
        postSubmitted: state.form.postSubmitted,
        userId: state.authData.user.googleId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPosts: ({ limit, skip }) => dispatch(getPosts({ limit, skip })),
        changeLikeDislike: (data) => dispatch(changeLikeDislike(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts)