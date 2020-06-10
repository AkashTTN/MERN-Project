const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse

const complaints = require('../models/Complaint/complaint.controller')

router
    .get('/complaints/all', async (req, res, next) => {

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
            } = await complaints.getAllComplaints(
                { limit, skip }
            )

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

    .patch('/complaints/:complaintId', async (req, res, next) => {

        const complaintId = req.params.complaintId
        const status = req.query.status

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