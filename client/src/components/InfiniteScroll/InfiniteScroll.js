import React, { useState, useEffect, useCallback } from "react";

import { connect } from 'react-redux'

import { getPosts, changeLikeDislike, deletePost } from '../../store/actions'

import Post from '../Posts/Post/Post'
import Spinner from '../UI/Spinner/Spinner'
import Filter from '../UI/Filter/Filter'

import '../Posts/Posts.css'

const InfinitePosts = ({
    deletePost,
    mode = 'buzz',
    formConfig,
    error,
    isLoading,
    posts,
    getPosts,
    changeLikeDislike,
    postDeleted,
    userId, totalPosts, postSubmitted }) => {

    const [hasMore, setHasMore] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)
    const [buzzFilterType, setBuzzFilterType] = useState('')

    const handleBuzzFilter = useCallback((filterType) => {

        setBuzzFilterType(filterType)

    }, [setBuzzFilterType])

    // get posts on post submission
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

    // Get posts on post delete
    useEffect(

        () => {
            if (postDeleted) {
                if (currentPage > 1) {
                    return setCurrentPage(1)
                }

                getPosts({
                    limit: postsPerPage,
                    skip: postsPerPage * currentPage - postsPerPage
                })
            }
        },
        [postDeleted, setCurrentPage, postsPerPage, setCurrentPage, getPosts]

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
                mode,
                limit: postsPerPage,
                category: buzzFilterType,
                skip: postsPerPage * currentPage - postsPerPage
            })
        }, [getPosts, mode, setCurrentPage, currentPage, postsPerPage, buzzFilterType]
    )

    let postsArray

    if (error) {
        postsArray = <p>Something went wrong</p>
    } else if (isLoading) {
        postsArray = <p>Loading...</p>
    } else {
        if (posts.length === 0) {
            postsArray = <p>No posts made {['None', ''].includes(buzzFilterType) ? '' : 'under this category'} yet.</p>
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
                        mode={mode}
                        deletePost={deletePost}
                    />
                )
            })
        }
    }

    return (
        <div className="Posts">
            <h3 className="PostsHeader flex-container" >
                <span>
                    <i className="fas fa-at"></i>&nbsp;&nbsp;Recent Buzz
                </span>
                {
                    !error
                    && <Filter
                        onChangeHandler={handleBuzzFilter}
                        filterTypes={formConfig ? formConfig.buzz.category : null}
                        filter={buzzFilterType} />
                }
            </h3>
            {
                postsArray
            }
            {
                isLoading &&
                <Spinner isMarginRequired />
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
        totalPosts: state.buzz.totalPosts,
        formConfig: state.form.formConfig,
        postDeleted: state.buzz.postDeleted
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPosts: (data) => dispatch(getPosts(data)),
        changeLikeDislike: (data) => dispatch(changeLikeDislike(data)),
        deletePost: (data) => dispatch(deletePost(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfinitePosts)