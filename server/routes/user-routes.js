const express = require('express')
const router = express.Router()
const users = require('../models/User/user.controller')

router
    .get('/feed', async (req, res) => {
        // const queryString = `/signin?success=true&username=${encodeURIComponent(req.user.displayName)}`
        // const queryString = `/feed?username=${encodeURIComponent(req.user.displayName)}`
        // res.redirect(constants.CLIENT_URL + queryString)

        const user = await users.getUserById(req.body.authData.userID)

        res.send({
            user
        })
        
    })

module.exports = router