const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse

const complaints = require('../models/Complaint/complaint.controller')

router

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