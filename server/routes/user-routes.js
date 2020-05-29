const express = require('express')
const router = express.Router()
const users = require('../models/User/user.controller')
const complaints = require('../models/Complaint/complaint.controller')
const posts = require('../models/Post/post.controller')
const response = require('v-response').ApiResponse
const multer = require('multer')
const fs = require('fs');

const generateUniqueId = require('../middlewares/generateUniqueId')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.url === '/complaint') {
            // Create directory if not present
            fs.mkdir(`./uploads/complaints/${req.user.authData.userID}/${req.uniqueId}`, { recursive: true }, (err) => {
                if (err) throw err;
            });

            // directory where the file will be stored
            cb(null, `uploads/complaints/${req.user.authData.userID}/${req.uniqueId}`)
        } else if (req.url === '/post') {
            // directory where the file will be stored
            cb(null, `uploads/posts/${req.user.authData.userID}/${req.uniqueId}`)
        }
    },
    filename: function (req, file, cb) {
        // name of the file
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

router

    .use('/uploads/complaints', express.static('uploads/complaints'))

    .get('/feed', async (req, res) => {

        try {
            const user = await users.getUserById(req.user.authData.userID)
    
            return res.status(200).json(response(true, 200, "Retrieved user feed data", { user }))
        } catch (error) {
            throw new Error(error)
        }

    })

    .get('/complaints', async (req, res) => {

        try {
            const userComplaints = await complaints.getAllComplaintsByUserId(req.user.authData.userID)
            return res.status(200).json(response(true, 200, "All complaints made by current user", userComplaints))
        } catch (error) {
            throw new Error(error)
        }

    })

    .post('/post', generateUniqueId, upload.array('images', 1), async (req, res) => {

        console.log('post request body', req.files)

        const { buzzText, buzzCategory } = JSON.parse(req.body.data)

        if (!buzzText || buzzText.trim().length === 0) {
            return res.status(200).json(response(false, 406, "Cannot create a buzz with empty text"))
        }

        const { email } = await users.getUserById(req.user.authData.userID)

        const data = {
            imageUrl: req.body.file ? 'link to file hosted on server' : '',
            text: buzzText,
            category: buzzCategory,
            googleId: req.user.authData.userID,
            email
        }

        const post = await posts.create(data)
        return res.status(200).json(response(true, 200, "Post created successfully", post))

    })

    .post('/complaint', generateUniqueId, upload.array('images'), async (req, res) => {

        // console.log('complaint request', req)

        const { concernText, issueTitle, department, email, name } = JSON.parse(req.body.data)

        if (!concernText || concernText.trim().length === 0) {
            return res.status(200).json(response(false, 406, "Cannot create a complaint with empty text"))
        }

        let imageUrlArray = []

        if (req.files) {
            req.files.forEach((file) => {
                imageUrlArray.push(`http://localhost:4000/user/${file.path}`)
            })
        }

        const data = {
            complaintId: req.uniqueId,
            imageUrl: imageUrlArray,
            text: concernText,
            googleId: req.user.authData.userID,
            email,
            issueTitle,
            department,
            name
        }

        try {
            const complaint = await complaints.create(data)
            return res.status(200).json(response(true, 200, "Complaint created successfully", complaint))
        } catch (error) {
            throw new Error(error)
        }

    })

    .get('/posts', async (req, res) => {

        let { limit, skip } = req.query

        if (isNaN(limit) && isNaN(skip)) {
            return res.status(200).json(response(false, 406, "Invalid limit/skip"))
        }

        // convert to number from string
        limit = +limit
        skip = +skip

        const postsToBeSent = await posts.getPosts({ limit, skip })

        return res.status(200).json(response(true, 200, "Retrieved posts", postsToBeSent))

    })

module.exports = router