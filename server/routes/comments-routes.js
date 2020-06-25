const express = require('express')
const router = express.Router()
const response = require('v-response').ApiResponse

const comments = require('../models/Comment/comment.controller')
const generateUniqueId = require('../middlewares/generateUniqueId')

router
    .get('/', async (req, res, next) => {

        try {

            const { buzzId } = req.query

            if (buzzId.trim().length === 0) {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        "Post id required"
                    )
                )
            }

            const comment = await comments.getCommentsByPostId(buzzId)

            if (comment) {
                return res.status(200).json(
                    response(
                        true,
                        200,
                        'Retrieved comments',
                        { comments: comment }
                    )
                )
            }

        } catch (err) {
            next(err)
        }

    })

    .post('/', generateUniqueId, async (req, res, next) => {

        try {

            const { buzzId } = req.query
            const { commentText, email, replyToId, name } = req.body

            if (commentText.trim().length === 0) {
                return res.status(200).json(
                    response(
                        false,
                        406,
                        'Cannot create a comment with empty text'
                    )
                )
            }

            const data = replyToId
                ? {
                    commentId: req.uniqueId,
                    text: commentText,
                    buzzId,
                    email,
                    name,
                    userId: req.user.authData.userID,
                    replyToId
                }
                : {
                    commentId: req.uniqueId,
                    text: commentText,
                    buzzId,
                    email,
                    name,
                    userId: req.user.authData.userID,
                }

            const comment = replyToId
                ? comments.addReplyToComment(data)
                : comments.addComment(data)

            if (comment) {
                return res.status(200).json(
                    response(
                        true, 200,
                        'Comment added',
                        { comment }
                    )
                )
            }

        } catch (err) {
            next(err)
        }

    })

module.exports = router