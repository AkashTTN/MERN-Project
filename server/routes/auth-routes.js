const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const config = require('../config/config')
const constants = require('../config/constants')

const users = require('../models/User/user.controller')

router.get('/google', passport.authenticate('google', {
    // Only show accounts that match the hosted domain.
    hd: config.google.GOOGLE_USER_HOST_DOMAIN,
    // Ensure the user can always select an account when sent to Google.
    prompt: 'select_account',
    scope: ['profile', 'email'],
    session: false
}))

// currently not reachable
router.get('/google/failed', (req, res) => {

    return res.send({ message: 'Google Authentication Failed' })

})

router.get('/google/redirect',
    passport.authenticate('google', {
        failureRedirect: constants.client.url,
        failureFlash: true,
        session: false
    }),
    async (req, res) => {

        let user = await users.getUserById(req.user.id)
        let userID

        if (user) {
            userID = user.googleId
        } else {

            // create user if it does not already exists
            user = await users.create({
                googleId: req.user.id,
                name: req.user.displayName,
                email: req.user.emails[0].value
            })

            userID = user.googleId
        }

        // send userID (googleID) in jwt
        jwt.sign({ userID }, config.jwt.secret, { expiresIn: '30s' }, (err, token) => {
            return res.redirect(constants.client.url + `?token=${token}`)
        });

    })

module.exports = router