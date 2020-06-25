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
    const response = await CommentModel.find({ buzzId }, { _id: 0 })
    return response
}

module.exports.addReplyToComment = async ({
    commentId,
    replyToId,
    buzzId, text, userId, email }) => {

    const commentedOn = CommentModel.find({ commentId: replyToId })

    if (commentedOn) {

        const comment = await CommentModel.create({
            commentId,
            buzzId,
            text,
            user: { googleId: userId, email }
        })

        if (comment) {
            const updatedCommentedOn = CommentModel.findOneAndUpdate({
                commentId: replyToId
            }, {
                $addToSet: { replies: comment.commentId }
            })

            return comment
        }
    }

}