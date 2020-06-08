import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'

import { getPosts, changeLikeDislike } from '../../store/actions'
import usePosts from '../hooks/usePosts'

import Post from './Post/Post'

import './Posts.css'

const NewPosts = ({
    postSubmitted,
    changeLikeDislike,
    userId,
}) => {

    let postsArray = null
    const [postsPerPage] = useState(5)
    const [pageNumber, setPageNumber] = useState(1)
    const { loading, posts, error, hasMore } = usePosts({ postsPerPage, pageNumber })
    const observer = React.forwardRef(null)
    const lastPostElementRef = useCallback(
        (node) => {
            if (loading) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPageNumber(prevPageNumber => prevPageNumber + 1)
                }

            })
            if (node) observer.current.observe(node)
        },
        [loading, hasMore]
    )

    useEffect(
        () => {
            if (postSubmitted) {
                setPageNumber(1)
            }
        },
        [postSubmitted, setPageNumber]
    )

    if (posts.length === 0) {
        postsArray = <p>No posts yet.</p>
    } else {
        postsArray = posts.map((post, index) => {

            const likeStatus = post.likedBy.includes(userId)
            const dislikeStatus = post.dislikedBy.includes(userId)

            if (posts.length === index + 1) {
                return (
                    <Post
                        key={index}
                        ref={lastPostElementRef}
                        data={post}
                        likeStatus={likeStatus}
                        dislikeStatus={dislikeStatus}
                        onChange={changeLikeDislike}
                        likeCount={post.likedBy.length}
                        dislikeCount={post.dislikedBy.length}
                    />
                )
            }
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

    return (
        <div className="Posts">
            <h3 className="PostsHeader" >
                <i className="fas fa-at"></i>&nbsp;&nbsp;Recent Buzz
            </h3>
            {postsArray}
            {console.log(lastPostElementRef)}
            {loading && <p>Loading...</p>}
            {error && <p>Something went wrong.</p>}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        postSubmitted: state.form.postSubmitted,
        userId: state.authData.user.googleId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeLikeDislike: (data) => dispatch(changeLikeDislike(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPosts)