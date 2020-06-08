import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getPosts } from '../../store/actions'

const usePosts = ({ postsPerPage, pageNumber }) => {

    const [hasMore, setHasMore] = useState(false)
    const posts = useSelector((state) => state.buzz.posts)
    const error = useSelector((state) => state.buzz.error)
    const loading = useSelector((state) => state.buzz.loading)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPosts({ postsPerPage, skip: postsPerPage * pageNumber - postsPerPage }))
    }, [postsPerPage, pageNumber, getPosts, dispatch])

    // setHasMore(posts.length > 0)

    return { loading, error, posts, hasMore }

}

export default usePosts