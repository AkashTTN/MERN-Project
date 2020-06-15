const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse
const multer = require('multer')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;

const complaints = require('../models/Complaint/complaint.controller')
const generateUniqueId = require('../middlewares/generateUniqueId')

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

    .post('/', generateUniqueId, upload.array('images'), async (req, res, next) => {

        try {

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

            if (req.files.length !== 0) {

                req.files.forEach((file) => {
                    cloudinary.uploader.upload(file.path,
                        {
                            public_id: file.path,
                            overwrite: false
                        },
                        async function (error, result) {

                            if (error) {
                                next(error)
                            }

                            // fs.rmdir(file.path,
                            //     { recursive: true },
                            //     (err) => {
                            //         if (err) console.log('Uploaded file needs to be removed from server.', err);
                            //     });

                            imageUrlArray.push(result.url)
                            // imageUrlArray.push(`http://localhost:4000/user/${file.path}`)

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

                            const complaint = await complaints.create(data)

                            return res.status(200).json(
                                response(
                                    true,
                                    200,
                                    "Complaint created successfully",
                                    complaint
                                )
                            )
                        });
                })
            } else {

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

                const complaint = await complaints.create(data)

                return res.status(200).json(
                    response(true, 200, "Complaint created successfully", complaint)
                )
            }


        } catch (error) {
            next(error)
        }

    })

    .patch('/:complaintId', async (req, res, next) => {

        try {

            const { complaintId } = req.params
            const { concernText } = req.body

            if (!concernText || concernText.trim().length === 0) {
                return res.status(200).json(
                    response(false, 406, "Complaint with empty text not allowed")
                )
            }

            const complaint = await complaints.getComplaintById({ complaintId })

            if (complaint.status === 'Resolved') {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        'Cannot edit a resolved complaint.'
                    )
                )
            }

            const updatedComplaint = await complaints.updateComplaint({
                complaintId, concernText
            })

            if (updatedComplaint.text === concernText) {
                return res.status(200).json(
                    response(
                        true,
                        200,
                        'Complaint updated successfully',
                        { updatedComplaint }
                    )
                )
            }

            return res.status(200).json(
                response(
                    false,
                    406,
                    'Complaint update unsuccessful',
                )
            )

        } catch (error) {
            next(error)
        }

    })

module.exports = router