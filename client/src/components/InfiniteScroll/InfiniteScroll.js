import React, { useState, useEffect } from "react";

import { connect } from 'react-redux'

import { getPosts, changeLikeDislike } from '../../store/actions'

import Post from '../Posts/Post/Post'
import Spinner from '../UI/Spinner/Spinner'

import '../Posts/Posts.css'

const InfinitePosts = ({
    error,
    isLoading,
    posts,
    getPosts,
    changeLikeDislike,
    userId, totalPosts, postSubmitted }) => {

    const [hasMore, setHasMore] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)

    useEffect(

        () => {
            if (postSubmitted) {
                if (currentPage > 1) {
                    return setCurrentPage(1)
                }

                getPosts({
                    limit: postsPerPage,
                    skip: postsPerPage * currentPage - postsPerPage
                })
            }
        },
        [postSubmitted, setCurrentPage, postsPerPage, setCurrentPage, getPosts]

    )

    useEffect(() => {
        setHasMore(totalPosts > posts.length)
    }, [setHasMore, totalPosts, posts])

    // const debounce = useCallback(function (func, params) {
    //     clearTimeout(time);

    //     setTime(setTimeout(func(params), 1000));
    // }, [setTime]);

    // Binds our scroll event handler
    window.onscroll = () => {
        // console.log(error, isLoading, hasMore)
        // Bails early if:
        // * there's an error
        // * it's already loading
        // * there's nothing left to load
        if (error || isLoading || !hasMore) return;

        // Checks that the page has scrolled to the bottom
        if (
            document.documentElement.clientHeight + document.documentElement.scrollTop
            >= document.documentElement.scrollHeight - 20
        ) {
            setCurrentPage((prevPageNumber => prevPageNumber + 1))
        }
    }

    useEffect(
        () => {
            getPosts({
                limit: postsPerPage,
                skip: postsPerPage * currentPage - postsPerPage
            })
        }, [getPosts, setCurrentPage, currentPage, postsPerPage]
    )

    let postsArray

    if (posts.length === 0) {
        postsArray = <p>No posts yet.</p>
    } else {
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

    return (
        <div className="Posts">
            <h3 className="PostsHeader" >
                <i className="fas fa-at"></i>&nbsp;&nbsp;Recent Buzz
            </h3>
            {
                postsArray
            }
            {
                error &&
                <p>Something went wrong.</p>
            }
            {
                isLoading &&
                <Spinner />
            }
            {
                !hasMore && (postsArray.length > 0) &&
                <p>You did it! You reached the end!</p>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        posts: state.buzz.posts,
        postSubmitted: state.form.postSubmitted,
        userId: state.authData.user.googleId,
        isLoading: state.buzz.loading,
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

export default connect(mapStateToProps, mapDispatchToProps)(InfinitePosts)