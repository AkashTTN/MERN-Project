const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse
const multer = require('multer')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
const Mailgen = require('mailgen')

const complaints = require('../models/Complaint/complaint.controller')
const generateUniqueId = require('../middlewares/generateUniqueId')
const sendEmail = require('../utils/sendEmail')

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
        // Appears in header & footer of e-mails
        name: process.env.APP_OFFICIAL_NAME,
        link: 'http://localhost:3000',
        // Optional product logo
        logo: '../../client/src/assets/images/ttn-logo-transparent.png',
        copyright: 'Copyright © 2020 To The New. All rights reserved.'
    }
});

function complaintStatusChangeEmail(complaint) {
    const email = {
        body: {
            name: complaint.createdBy.name,
            intro: `Status of complaint (${complaint.complaintId}) locked by you has been updated.`,
            action: {
                instructions: 'To view your complaint, login to the app:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Login',
                    link: 'http://localhost:3000'
                }
            },
            dictionary: {
                'Creation Date': new Date(complaint.createdAt).toDateString(),
                'Assigned To': complaint.assignedTo.name,
                'Department': complaint.department,
                'Issue Title': complaint.issueTitle,
                'Updated Status': complaint.status
            },
            outro: 'Need help, or have questions? Visit the page linked above. We\'d love to help.',
            action: {
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Help',
                    link: 'http://localhost:3000/help'
                }
            },

        }
    };

    // Generate an HTML email with the provided contents
    return mailGenerator.generate(email);
}

function complaintCreatedEmail(complaint) {

    const email = {
        body: {
            name: complaint.createdBy.name,
            intro: 'You have successfully locked a complaint.',
            action: {
                instructions: 'To view your complaint, login to the app:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Login',
                    link: 'http://localhost:3000'
                }
            },
            dictionary: {
                'Complaint Id': complaint.complaintId,
                'Date': new Date(complaint.createdAt).toDateString(),
                'Assigned To': complaint.assignedTo.name,
                'Department': complaint.department,
                'Issue Title': complaint.issueTitle,
                'Status': complaint.status
            },
            outro: 'Need help, or have questions? Visit the page linked above. We\'d love to help.',
            action: {
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Help',
                    link: 'http://localhost:3000/help'
                }
            },

        }
    };

    // Generate an HTML email with the provided contents
    return mailGenerator.generate(email);

}

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

        let { limit, skip, userId, statusFilter } = req.query

        if (isNaN(limit) && isNaN(skip)) {
            return res.status(200).json(response(false, 406, "Invalid limit/skip"))
        }

        if (req.user.authData.role === 'admin' && !userId) {

            // convert to number from string
            limit = +limit
            skip = +skip

            try {

                const {
                    userComplaints = [],
                    count: [{ totalComplaints = 0 } = {}] = []
                } = (statusFilter !== 'None' && statusFilter !== '')
                        ? await complaints.getAllComplaintsByStatusTypes({ limit, skip, status: statusFilter })
                        : await complaints.getAllComplaints({ limit, skip })

                return res.status(200).json(
                    response(
                        true,
                        200,
                        "All complaints made by all the users",
                        { complaints: userComplaints, totalComplaints }
                    )
                )

            } catch (error) {
                next(error)
            }

        } else {

            // convert to number from string
            limit = +limit
            skip = +skip

            try {

                let {
                    userComplaints = [],
                    count: [{ totalComplaints = 0 } = {}] = []
                } = await complaints.getAllComplaintsByUserId(
                    { id: req.user.authData.userID, limit, skip }
                )

                if (statusFilter && statusFilter !== 'None' && statusFilter !== '') {
                    userComplaints = userComplaints.filter(complaint => complaint.status === statusFilter)
                    totalComplaints = userComplaints.length
                }


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

                imageUrlArray.push(
                    req.files.map(async (file) => {
                        return cloudinary.uploader.upload(file.path,
                            {
                                public_id: file.path,
                                overwrite: false
                            }

                            //     // fs.rmdir(file.path,
                            //     //     { recursive: true },
                            //     //     (err) => {
                            //     //         if (err) console.log('Uploaded file needs to be removed from server.', err);
                            //     //     });

                        );
                    })
                )

                Promise.all(...imageUrlArray)
                    .then(responseObjects => {
                        return responseObjects.map(object => object.url)
                    })
                    .then(async (imageUrlArray) => {

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

                        const { complaint } = await complaints.create(data)

                        const emailBody = complaintCreatedEmail(complaint)

                        sendEmail({
                            emailTo: complaint.createdBy.email,
                            emailBody,
                            emailSubject: 'TTND-BUZZ: Complaint locked'
                        })

                        return res.status(200).json(
                            response(
                                true,
                                200,
                                "Complaint created successfully",
                                { complaint }
                            )
                        )
                    })
                    .catch(err => next(err))

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

                const { complaint } = await complaints.create(data)

                const emailBody = complaintCreatedEmail(complaint)

                sendEmail({
                    emailTo: complaint.createdBy.email,
                    emailBody,
                    emailSubject: 'TTND-BUZZ: Complaint locked'
                })


                return res.status(200).json(
                    response(true, 200, "Complaint created successfully", { complaint })
                )
            }


        } catch (error) {
            next(error)
        }

    })

    .patch('/:complaintId', async (req, res, next) => {

        const complaintId = req.params.complaintId
        const status = req.query.status

        if (req.user.authData.role === 'admin' && status) {

            if (!complaintId || complaintId.trim().length === 0) {
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

                    const emailBody = complaintStatusChangeEmail(complaint)

                    sendEmail({
                        emailTo: complaint.createdBy.email,
                        emailBody,
                        emailSubject: 'TTND-BUZZ: Complaint Status Update'
                    })

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
        } else {
            try {

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
        }

    })

module.exports = router