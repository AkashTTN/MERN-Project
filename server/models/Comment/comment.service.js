const CommentModel = require('./comment.model')
const posts = require('../../models/Post/post.controller')

module.exports.addComment = async ({ commentId, buzzId, text, name, userId, email }) => {
    const comment = await CommentModel.create({
        commentId, buzzId, text, user: { googleId: userId, email, name }
    })

    await posts.addCommentToPost({ buzzId, commentId })

    return comment
}

module.exports.getCommentsByPostId = async (buzzId) => {
    const response = await CommentModel.find({ buzzId, replyToId: '' }, { _id: 0 })
    return response
}

module.exports.addReplyToComment = async ({
    commentId,
    replyToId,
    name,
    buzzId, text, userId, email }) => {

    const commentedOn = CommentModel.find({ commentId: replyToId })

    if (commentedOn) {

        const comment = await CommentModel.create({
            commentId,
            buzzId,
            replyToId,
            text,
            user: { googleId: userId, email, name }
        })

        if (comment) {
            const updatedCommentedOn = await CommentModel.findOneAndUpdate({
                commentId: replyToId
            }, {
                $push: {
                    replies: comment
                }
            }, { new: true })

            return comment
        }
    }

}