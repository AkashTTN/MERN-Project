const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse
const multer = require('multer')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;

const posts = require('../models/Post/post.controller')
const users = require('../models/User/user.controller')
const generateUniqueId = require('../middlewares/generateUniqueId')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create directory if not present
        fs.mkdir(`./uploads/posts/${req.user.authData.userID}/${req.uniqueId}`,
            { recursive: true },
            (err) => {
                if (err) throw err;
                // directory where the file will be stored
                cb(null, `./uploads/posts/${req.user.authData.userID}/${req.uniqueId}`)
            });
    },
    filename: function (req, file, cb) {
        // name of the file
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

router
    .get('/', async (req, res, next) => {

        let { limit, skip, category } = req.query
        const userId = req.user.authData.userID

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
                    ? await posts.getPostsByUserIdAndCategory({ limit, skip, category, userId })
                    : await posts.getPostsByUserId({ limit, skip, userId })

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

    .post('/', generateUniqueId, upload.array('images'), async (req, res, next) => {

        try {

            const { buzzText, buzzCategory } = JSON.parse(req.body.data)

            if (!buzzText || buzzText.trim().length === 0) {
                return res.status(200).json(
                    response(false, 406, "Cannot create a buzz with empty text")
                )
            }

            let imageUrlArray = []

            if (req.files.length !== 0) {

                imageUrlArray.push(
                    req.files.map(async (file) => {
                        return cloudinary.uploader.upload(file.path,
                            {
                                public_id: file.path,
                                overwrite: false
                            }

                        );
                    })
                )

                Promise.all(...imageUrlArray)
                    .then(responseObjects => {
                        return responseObjects.map(object => object.url)
                    })
                    .then(async (imageUrlArray) => {

                        const { email } = await users.getUserById(req.user.authData.userID)

                        const data = {
                            buzzId: req.uniqueId,
                            imageUrl: imageUrlArray,
                            text: buzzText,
                            category: buzzCategory,
                            googleId: req.user.authData.userID,
                            email
                        }


                        const post = await posts.create(data)

                        return res.status(200).json(
                            response(true, 200, "Post created successfully", post)
                        )

                    })
                    .catch(err => next(err))

            } else {

                const { email } = await users.getUserById(req.user.authData.userID)

                const data = {
                    buzzId: req.uniqueId,
                    imageUrl: imageUrlArray,
                    text: buzzText,
                    category: buzzCategory,
                    googleId: req.user.authData.userID,
                    email
                }

                const post = await posts.create(data)

                return res.status(200).json(
                    response(true, 200, "Post created successfully", post)
                )
            }


        } catch (error) {
            next(error)
        }

    })

    .patch('/:id', async (req, res, next) => {

        try {
            let { type, status } = req.query
            const buzzId = req.params.id
            const googleId = req.user.authData.userID
            let updatedPost

            status = status === 'false' ? false : true

            if (type === 'like') {
                updatedPost = await posts.changeLike({
                    type,
                    status,
                    buzzId,
                    googleId
                })
            } else if (type === 'dislike') {
                updatedPost = await posts.changeDislike({ type, status, buzzId, googleId })
            }

            res.status(200).json(
                response(true, 200, 'Changed like/dislike status', { updatedPost })
            )

        } catch (error) {
            next(error)
        }

    })

    .delete('/:id', async (req, res, next) => {

        try {

            const id = req.params.id

            if (id.trim().length === 0) {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        "Post id required.",
                    )
                )
            }

            const result = await posts.deletePostById(id)
            
            if (result.deletedCount === 1) {
                return res.status(200).json(
                    response(
                        true,
                        200,
                        "Post deleted successfully"
                    )
                )
            }

            return res.status(200).json(
                response(
                    false,
                    406,
                    'Post deletion unsuccessful'
                )
            )

        } catch (error) {
            next(error)
        }

    })

module.exports = router