const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse
const Mailgen = require('mailgen')

const complaints = require('../models/Complaint/complaint.controller')
const users = require('../models/User/user.controller')
const isEmptyString = require('../utils/isEmptyString')
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

function profileUpdateRejectedEmail({ name, team }) {
    const email = {
        body: {
            name,
            intro: `Request for profile update is rejected.`,
            action: {
                instructions: 'To view your complaint, login to the app:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Login',
                    link: 'http://localhost:3000'
                }
            },
            dictionary: {
                'Name': name,
                'Team': team
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

function profileUpdateApprovedEmail({ name, team }) {
    const email = {
        body: {
            name,
            intro: `Request for profile update is accepted. Updated details are mentioned below.`,
            action: {
                instructions: 'To view your complaint, login to the app:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Login',
                    link: 'http://localhost:3000'
                }
            },
            dictionary: {
                'Name': name,
                'Team': team
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

router

    .get('/requests', async (req, res, next) => {

        try {

            const usersWithRequests = await users.getUsersWithPendingRequests()

            return res.status(200).json(
                response(
                    true,
                    200,
                    'All users with pending requests',
                    { users: usersWithRequests }
                )
            )
        } catch (error) {
            next(error)
        }

    })

    .put('/requests', async (req, res, next) => {
        try {

            const { updateProfileUpdateStatus, id } = req.query

            if (updateProfileUpdateStatus && id) {

                if (isEmptyString(updateProfileUpdateStatus) || isEmptyString(id)) {
                    return res.status(200).json(
                        response(
                            false,
                            406,
                            'Inadequate data sent.'
                        )
                    )
                }

                const updatedUser = await users.updateRequestStatus({
                    userId: id,
                    status: updateProfileUpdateStatus,
                })

                if (updatedUser.updateStatus) {
                    return res.status(200).json(
                        response(
                            false,
                            406,
                            'Profile update request status cannot be changed. Probably its already accepted.'
                        )
                    )
                }

                const emailBody = updateProfileUpdateStatus === 'rejected'
                    ? profileUpdateRejectedEmail({
                        name: updatedUser.name,
                        team: updatedUser.team
                    })
                    : profileUpdateApprovedEmail({
                        name: updatedUser.name,
                        team: updatedUser.team
                    })

                sendEmail({
                    emailTo: updatedUser.email,
                    emailBody,
                    emailSubject: `TTND-BUZZ: Profile Update Request ${updateProfileUpdateStatus === 'rejected' ? 'Rejected' : 'Approved'}`
                })

                if (updateProfileUpdateStatus === 'rejected') {
                    return res.status(200).json(
                        response(
                            true,
                            200,
                            'Profile update request rejected.'
                        )
                    )
                }

                return res.status(200).json(
                    response(
                        true,
                        200,
                        'Profile update request approved.'
                    )
                )

            } else {
                throw new Error('Query parameter not found.')
            }

        } catch (error) {
            next(error)
        }
    })

    .patch('/complaints/assign/:complaintId', async (req, res, next) => {

        const complaintId = req.params.complaintId

        if (!complaintId || complaintId.trim().length === 0) {
            return res.status(200).json(response(false, 406, 'Complaint ID required'))
        }

        try {

            const name = req.body.name
            const googleId = req.body.googleId
            const complaintId = req.body.complaintId

            const complaint = await complaints.assignComplaint({
                complaintId,
                googleId,
                name
            })

            if (complaint &&
                (complaint.assignedTo.name === name && complaint.assignedTo.googleId)) {
                return res.status(200).json(
                    response(
                        true,
                        200,
                        'Complaint successfully assigned',
                        { complaint }
                    )
                )

            } else {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        'Complaint assignment unsuccessful'
                    )
                )
            }

        } catch (error) {
            next(error)
        }

    })



module.exports = router