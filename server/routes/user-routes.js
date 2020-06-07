const express = require('express')
const router = express.Router()
const users = require('../models/User/user.controller')
const response = require('v-response').ApiResponse

const UIConfig = require('../config/constants').UIConfig

const postsRoutes = require('./posts-routes')
const complaintsRoutes = require('./complaints-routes')

router

    .use('/uploads/complaints', express.static('uploads/complaints'))
    .use('/uploads/posts', express.static('uploads/posts'))
    .use('/posts', postsRoutes)
    .use('/complaints', complaintsRoutes)

    .get('/', async (req, res) => {

        try {

            const user = await users.getUserById(req.user.authData.userID)

            return res.status(200).json(
                response(true, 200, "Retrieved user data", { user })
            )

        } catch (error) {
            throw new Error(error)
        }

    })

    .get('/form-config', (req, res) => {
        res.status(200).json(
            response(true, 200, 'Form Config Data', { formConfig: UIConfig.formConfig })
        )
    })

module.exports = router