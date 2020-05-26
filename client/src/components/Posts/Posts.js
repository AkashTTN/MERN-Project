import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { getPosts } from '../../store/actions'

import Post from './Post/Post'

import './Posts.css'

const Posts = ({ posts, getPosts, postSubmitted }) => {

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
            if(postSubmitted) {
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
        if(posts.length === 0) {
            postsArray = <p>No posts yet.</p>
        } else {
            skip = posts.length
            postsArray = posts.map((post, index) => {
                return (
                    <Post data={post} key={index} />
                )
            })
        }
    }

    return (
        <div className="Posts" ref={postsDiv}>
            <h3 className="PostsHeader" >Recent Buzz</h3>
            {postsArray}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        posts: state.buzz.posts,
        postSubmitted: state.form.postSubmitted
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPosts: ({ limit, skip }) => dispatch(getPosts({ limit, skip }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts)