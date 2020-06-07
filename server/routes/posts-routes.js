const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse
const multer = require('multer')
const fs = require('fs')

const posts = require('../models/Post/post.controller')
const users = require('../models/User/user.controller')
const generateUniqueId = require('../middlewares/generateUniqueId')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create directory if not present
        fs.mkdir(`./uploads/posts/${req.user.authData.userID}/${req.uniqueId}`, { recursive: true }, (err) => {
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
    .get('/', async (req, res) => {

        let { limit, skip } = req.query

        if (isNaN(limit) && isNaN(skip)) {
            return res.status(200).json(response(false, 406, "Invalid limit/skip"))
        }

        // convert to number from string
        limit = +limit
        skip = +skip

        try {
            const postsToBeSent = await posts.getPosts({ limit, skip })
            return res.status(200).json(response(true, 200, "Retrieved posts", postsToBeSent))
        } catch (error) {
            next(error)
        }

    })

    .post('/', generateUniqueId, upload.array('images', 1), async (req, res) => {

        // console.log('post request body', req.user)

        try {

            const { buzzText, buzzCategory } = JSON.parse(req.body.data)

            if (!buzzText || buzzText.trim().length === 0) {
                return res.status(200).json(response(false, 406, "Cannot create a buzz with empty text"))
            }

            let imageUrlArray = []

            if (req.files) {
                req.files.forEach((file) => {
                    imageUrlArray.push(`http://localhost:4000/user/${file.path}`)
                })
            }

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
            return res.status(200).json(response(true, 200, "Post created successfully", post))

        } catch (error) {
            next(error)
        }

    })

    .patch('/:id', async (req, res, next) => {
        
        try {
            let { type, status } = req.query
            const buzzId = req.params.id
            const googleId = req.user.authData.userID
    
            status = status === 'false' ? false : true

            let updatedPost
            if (type === 'like') {
                updatedPost = await posts.changeLike({ type, status, buzzId, googleId })
            } else if (type === 'dislike') {
                updatedPost = await posts.changeDislike({ type, status, buzzId, googleId })
            }

            res.status(200).json(response(true, 200, 'Changed like/dislike status', { updatedPost }))
        } catch (error) {
            next(error)
        }

    })


module.exports = router