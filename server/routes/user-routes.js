const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse

const users = require('../models/User/user.controller')
const UIConfig = require('../models/UIConfig/UIConfig.controller')
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

    .get('/form-config', async (req, res, next) => {

        try {

            const [{ formConfig = {} } = {}] = await UIConfig.getUIConfig()
            res.status(200).json(
                response(true, 200, 'Form Config Data', { formConfig })
            )
        } catch (error) {
            next(error)
        }

    })

module.exports = router