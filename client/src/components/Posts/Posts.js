import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'

import { getPosts, changeLikeDislike } from '../../store/actions'

import Post from './Post/Post'
import Spinner from '../UI/Spinner/Spinner'

import './Posts.css'

const Posts = ({
    posts,
    totalPosts,
    getPosts,
    postSubmitted,
    changeLikeDislike,
    userId,
    error,
    loading
}) => {

    let postsArray = null
    const [postsPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(
        () => {
            if (currentPage === 1 || postSubmitted) {
                getPosts({
                    limit: postsPerPage,
                    skip: 0
                })
                setCurrentPage(2)
            }
        },
        [getPosts, postsPerPage, setCurrentPage, postSubmitted]
    )

    const handleNext = useCallback(
        () => {
            setCurrentPage(prevPage => prevPage + 1, getPosts({
                limit: postsPerPage,
                skip: postsPerPage * currentPage - postsPerPage
            }))
        },
        [getPosts, postsPerPage, currentPage, setCurrentPage]
    )

    if (error) {
        postsArray = <p>Something went wrong.</p>
    } else if (loading) {
        postsArray = <p>Loading...</p>
    } else if (posts.length === 0) {
        postsArray = <p>No posts yet.</p>
    } else {
        postsArray = posts.map((post, index) => {

            const likeStatus = post.likedBy.includes(userId)
            const dislikeStatus = post.dislikedBy.includes(userId)

            // if (posts.length === index + 1) {
            //     return (
            //         <Post
            //             key={index}
            //             ref={lastPostElementRef}
            //             data={post}
            //             likeStatus={likeStatus}
            //             dislikeStatus={dislikeStatus}
            //             onChange={changeLikeDislike}
            //             likeCount={post.likedBy.length}
            //             dislikeCount={post.dislikedBy.length}
            //         />
            //     )
            // }
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
            <InfiniteScroll
                dataLength={posts.length}
                next={handleNext}
                hasMore={posts.length < totalPosts}
                loader={<Spinner />}
            >
                {postsArray}
            </InfiniteScroll>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        posts: state.buzz.posts,
        postSubmitted: state.form.postSubmitted,
        userId: state.authData.user.googleId,
        loading: state.buzz.loading,
        error: state.buzz.error,
        totalPosts: state.buzz.totalPosts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPosts: (data) => dispatch(getPosts(data)),
        changeLikeDislike: (data) => dispatch(changeLikeDislike(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts)