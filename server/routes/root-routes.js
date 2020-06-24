const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse
const posts = require('../models/Post/post.controller')

router
    .get('/posts', async (req, res, next) => {

        let { limit, skip, category } = req.query

        if (isNaN(limit) && isNaN(skip)) {
            return res.status(200).json(response(false, 406, "Invalid limit/skip"))
        }

        // convert to number from string
        limit = +limit
        skip = +skip

        try {

            const {
                allPosts = [],
                count: [{ totalPosts = 0 } = {}] = []
            } = (category !== 'None' && category !== '')
                    ? await posts.getPostsByCategory({ limit, skip, category })
                    : await posts.getPosts({ limit, skip })

            return res.status(200).json(
                response(
                    true,
                    200,
                    "Retrieved posts",
                    { posts: allPosts, totalPosts }
                )
            )

        } catch (error) {
            next(error)
        }

    })

module.exports = router