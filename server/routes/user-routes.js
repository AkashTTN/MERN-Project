const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse
const Mailgen = require('mailgen')

const users = require('../models/User/user.controller')
const UIConfig = require('../models/UIConfig/UIConfig.controller')
const postsRoutes = require('./posts-routes')
const complaintsRoutes = require('./complaints-routes')
const sendEmail = require('../utils/sendEmail')
const isEmptyString = require('../utils/isEmptyString')

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

function profileUpdateEmail(data) {
    const email = {
        body: {
            name: data.old.name,
            intro: `Request for profile update is locked and send to the admin.`,
            action: {
                instructions: 'To view your complaint, login to the app:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Login',
                    link: 'http://localhost:3000'
                }
            },
            dictionary: {
                'Creation Date': new Date().toDateString(),
                'Old Name': data.old.name,
                'New Name': data.new.name,
                'Old Team': data.old.team,
                'New Team': data.new.team
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

    .get('/chats', async (req, res, next) => {
        try {
            const chats = await users.getChats({ id: req.user.authData.userID })
            res.status(200).json(
                response(true, 200, 'Chat data', { chats })
            )
        } catch (error) {
            next(error)
        }
    })

    .delete('/chats/:id', async (req, res, next) => {
        try {

            const { id } = req.params

            if (isEmptyString(id)) {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        'Chat id required'
                    )
                )
            }

            const chats = await users.deleteChat({ id })

            res.status(200).json(
                response(true, 200, 'Chat data', { chats })
            )
        } catch (error) {
            next(error)
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

    .get('/followers', async (req, res, next) => {

        try {

            const { followersData } = await users.getFollowers({ id: req.user.authData.userID })

            res.status(200).json(
                response(true, 200, 'Followers Data', { followers: followersData })
            )
        } catch (error) {
            next(error)
        }

    })

    .get('/following', async (req, res, next) => {

        try {

            const { followingData } = await users.getFollowing({ id: req.user.authData.userID })

            res.status(200).json(
                response(true, 200, 'Following users Data', { following: followingData })
            )
        } catch (error) {
            next(error)
        }

    })

    .get('/friends', async (req, res, next) => {

        try {

            const { friendsData } = await users.getFriends({ id: req.user.authData.userID })

            res.status(200).json(
                response(true, 200, 'Friends Data', { friends: friendsData })
            )
        } catch (error) {
            next(error)
        }

    })

    .put('/', async (req, res, next) => {

        try {

            const { name, team } = req.body

            if (isEmptyString(name) || isEmptyString(team)) {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        'Invalid data'
                    )
                )
            }

            const updatedUser = await users.updateProfile({
                name, team,
                id: req.user.authData.userID
            })

            if (updatedUser) {

                const userData = await users.getUserById(req.user.authData.userID)

                const emailBody = profileUpdateEmail({
                    old: { name: userData.name, team: userData.team },
                    new: { name, team }
                })

                sendEmail({
                    emailTo: userData.email,
                    emailBody,
                    emailSubject: 'TTND-BUZZ: Profile Update Request Locked'
                })

                return res.status(200).json(
                    response(
                        true,
                        200,
                        'User information update request locked',
                        { user: updatedUser }
                    )
                )
            }

        } catch (error) {
            next(error)
        }
    })

    .get('/search-user', async (req, res, next) => {
        try {

            const { name } = req.query

            if (isEmptyString(name)) {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        'Name to search is empty',
                    )
                )
            }

            const matchingUsers = await users.getUsersByName({ name })

            return res.status(200).json(
                response(
                    true,
                    200,
                    'All users matching the given name',
                    { users: matchingUsers }
                )
            )

        } catch (err) {
            next(err)
        }
    })

    .patch('/follow', async (req, res, next) => {

        try {
            let { userId, status } = req.query

            if (isEmptyString(userId) || isEmptyString(status)) {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        'Invalid query parameters'
                    )
                )
            }

            status = status === 'false' ? false : true

            const updatedRecord = await users.updateFollowStatus({
                id: req.user.authData.userID,
                followId: userId,
                status,
            })

            return res.status(200).json(
                response(
                    true,
                    200,
                    'Follow status changed'
                )
            )

        } catch (err) {
            next(err)
        }

    })

    .patch('/friend', async (req, res, next) => {

        try {
            let { userId, status } = req.query

            if (isEmptyString(userId) || isEmptyString(status)) {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        'Invalid query parameters'
                    )
                )
            }

            status = status === 'false' ? false : true

            const updatedRecord = await users.updateFriendStatus({
                id: req.user.authData.userID,
                friendId: userId,
                status,
            })

            return res.status(200).json(
                response(
                    true,
                    200,
                    'Friend status changed'
                )
            )

        } catch (err) {
            next(err)
        }

    })

module.exports = router