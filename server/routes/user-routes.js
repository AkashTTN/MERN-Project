const express = require('express')
const router = express.Router()
const users = require('../models/User/user.controller')
const complaints = require('../models/Complaint/complaint.controller')
const posts = require('../models/Post/post.controller')
const response = require('v-response').ApiResponse
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router
    .get('/', async (req, res) => {

        const user = await users.getUserById(req.user.authData.userID)

        return res.status(200).json(response(true, 200, "Retrieved user data", { user }))

    })

    .get('/complaints', async (req, res) => {

        const userComplaints = await complaints.getAllComplaintsByUserId(req.user.authData.userID)
        return res.status(200).json(response(true, 200, "All complaints made by current user", userComplaints))

    })

    .post('/post', upload.single('image1'), async (req, res) => {

        // console.log('post request body',  req.body)

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

    .post('/complaint', upload.single('image1'), async (req, res) => {

        // console.log('complaint request body',  req.body)

        const { concernText, issueTitle, department, email, name } = JSON.parse(req.body.data)

        if (!concernText || concernText.trim().length === 0) {
            return res.status(200).json(response(false, 406, "Cannot create a complaint with empty text"))
        }

        const data = {
            imageUrl: req.body.file ? 'link to file hosted on server' : '',
            text: concernText,
            googleId: req.user.authData.userID,
            email,
            issueTitle,
            department,
            name
        }

        const complaint = await complaints.create(data)
        return res.status(200).json(response(true, 200, "Complaint created successfully", complaint))

    })

    .get('/posts', async (req, res) => {

        let { limit, skip } = req.query

        if(isNaN(limit) && isNaN(skip)) {
            return res.status(200).json(response(false, 406, "Invalid limit/skip"))
        }

        // convert to number from string
        limit = +limit
        skip = +skip
        
        const postsToBeSent = await posts.getPosts({ limit, skip })

        return res.status(200).json(response(true, 200, "Retrieved posts", postsToBeSent))

    })

module.exports = router