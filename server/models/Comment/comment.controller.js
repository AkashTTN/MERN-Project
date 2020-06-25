const comments = require('./comment.service')

module.exports.addComment = async (data) => {
    return await comments.addComment(data)
}

module.exports.addReplyToComment = async (data) => {
    return await comments.addReplyToComment(data)
}

module.exports.getCommentsByPostId = async (data) => {
    return await comments.getCommentsByPostId(data)
}