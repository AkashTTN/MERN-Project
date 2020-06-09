const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse
const multer = require('multer')
const fs = require('fs')

const complaints = require('../models/Complaint/complaint.controller')
const generateUniqueId = require('../middlewares/generateUniqueId')
const isAdmin = require('../middlewares/isAdmin')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create directory if not present
        fs.mkdir(`./uploads/complaints/${req.user.authData.userID}/${req.uniqueId}`,
            { recursive: true },
            (err) => {
                if (err) throw err;
                // directory where the file will be stored
                cb(null, `./uploads/complaints/${req.user.authData.userID}/${req.uniqueId}`)
            }
        );
    },
    filename: function (req, file, cb) {
        // name of the file
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

router

    .get('/', async (req, res, next) => {

        let { limit, skip } = req.query

        if (isNaN(limit) && isNaN(skip)) {
            return res.status(200).json(response(false, 406, "Invalid limit/skip"))
        }

        // convert to number from string
        limit = +limit
        skip = +skip

        try {

            const {
                userComplaints = [],
                count: [{ totalComplaints = 0 } = {}] = []
            } = await complaints.getAllComplaintsByUserId(
                { id: req.user.authData.userID, limit, skip }
            )

            return res.status(200).json(
                response(
                    true,
                    200,
                    "All complaints made by current user",
                    { complaints: userComplaints, totalComplaints }
                )
            )

        } catch (error) {
            next(error)
        }

    })

    .post('/', generateUniqueId, upload.array('images'), async (req, res) => {

        // console.log('complaint request', req)

        const {
            concernText,
            issueTitle,
            department,
            email,
            name } = JSON.parse(req.body.data)

        if (!concernText || concernText.trim().length === 0) {
            return res.status(200).json(
                response(false, 406, "Cannot create a complaint with empty text")
            )
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

            return res.status(200).json(
                response(true, 200, "Complaint created successfully", complaint)
            )

        } catch (error) {
            next(error)
        }

    })

    .patch('/:complaintId', isAdmin, async (req, res) => {

        const complaintId = req.params.complaintId
        const status = req.query.status

        if (complaintId.trim().length === 0) {
            return res.status(200).json(response(false, 406, 'Complaint ID required'))
        }

        if (!status) {
            return res.status(200).json(
                response(false, 406, 'Updated Complaint status required')
            )
        }

        try {

            const complaint = await complaints.changeStatusById({ complaintId, status })

            if (complaint.status === status) {
                res.status(200).json(
                    response(
                        true,
                        200,
                        'Complaint status changed',
                        { complaint: { updatedStatus: status } }
                    )
                )
            } else {
                res.status(200).json(response(false, 406, 'Complaint status unchanged'))
            }

        } catch (error) {
            next(error)
        }

    })

module.exports = router