const express = require('express')
const router = express.Router()
const users = require('../models/User/user.controller')
const complaints = require('../models/Complaint/complaint.controller')
const posts = require('../models/Post/post.controller')
const response = require('v-response').ApiResponse
const multer = require('multer')
const fs = require('fs');

const generateUniqueId = require('../middlewares/generateUniqueId')
const isAdmin = require('../middlewares/isAdmin')

const UIConfig = require('../config/constants').UIConfig

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.url === '/complaints') {
            // Create directory if not present
            fs.mkdir(`./uploads/complaints/${req.user.authData.userID}/${req.uniqueId}`, { recursive: true }, (err) => {
                if (err) throw err;
                // directory where the file will be stored
                cb(null, `./uploads/complaints/${req.user.authData.userID}/${req.uniqueId}`)
            });

        } else if (req.url === '/posts') {
            // Create directory if not present
            fs.mkdir(`./uploads/posts/${req.user.authData.userID}/${req.uniqueId}`, { recursive: true }, (err) => {
                if (err) throw err;
                // directory where the file will be stored
                cb(null, `./uploads/posts/${req.user.authData.userID}/${req.uniqueId}`)
            });
        }
    },
    filename: function (req, file, cb) {
        // name of the file
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })
const postsRoutes = require('./posts-routes')

router

    .use('/uploads/complaints', express.static('uploads/complaints'))
    .use('/uploads/posts', express.static('uploads/posts'))
    .use('/posts', postsRoutes)

    .get('/', async (req, res) => {

        try {
            const user = await users.getUserById(req.user.authData.userID)
            return res.status(200).json(response(true, 200, "Retrieved user data", { user }))
        } catch (error) {
            throw new Error(error)
        }

    })

    .get('/form-config', (req, res) => {
        res.status(200).json(response(true, 200, 'Form Config Data', { formConfig: UIConfig.formConfig }))
    })

    .get('/complaints', async (req, res) => {

        try {
            const userComplaints = await complaints.getAllComplaintsByUserId(req.user.authData.userID)
            return res.status(200).json(response(true, 200, "All complaints made by current user", userComplaints))
        } catch (error) {
            throw new Error(error)
        }

    })

    .post('/complaints', generateUniqueId, upload.array('images'), async (req, res) => {

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

    .patch('/:complaintId', isAdmin, async (req, res) => {

        const complaintId = req.params.complaintId
        const status = req.query.status

        if (complaintId.trim().length === 0) {
            return res.status(200).json(response(false, 406, 'Complaint ID required.'))
        }

        if (!status) {
            return res.status(200).json(response(false, 406, 'Updated Complaint status required'))
        }

        try {
            const complaint = await complaints.changeStatusById({ complaintId, status })

            if (complaint.nModified === 1) {
                res.status(200).json(response(true, 200, 'Complaint status changed', { complaint: { updatedStatus: status } }))
            } else {
                res.status(200).json(response(false, 406, 'Complaint status unchanged'))
            }

        } catch (error) {
            throw new Error(error)
        }

    })

module.exports = router