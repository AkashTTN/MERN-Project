const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const constants = require('../config/constants')
const keys = require('../config/keys')

const users = require('../models/User/user.controller')

router.get('/google', passport.authenticate('google', {
    // Only show accounts that match the hosted domain.
    hd: constants.GOOGLE_USER_HOST_DOMAIN,
    // Ensure the user can always select an account when sent to Google.
    prompt: 'select_account',
    scope: ['profile', 'email'],
    session: false
}))

router.get('/google/failed', (req, res) => {

    return res.send({ message: 'Google Authentication Failed' })

})

router.get('/google/redirect',
    passport.authenticate('google', {
        failureRedirect: constants.CLIENT_URL,
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
        jwt.sign({ userID }, keys.jwt.secret, { expiresIn: '1day' }, (err, token) => {
            return res.redirect(constants.CLIENT_URL + `/feed?token=${token}`)
        });

    })

router.delete('/logout', (req, res) => {
    req.logout()
    return res.status(200).send({ message: 'Logout Successful.' })
})

module.exports = router