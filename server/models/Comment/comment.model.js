const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {   
        commentId: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        replyToId: {
            type: String,
            default: ''
        },
        buzzId: String,
        user: {
            email: {
                type: String,
                required: true,
            },
            googleId: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        },
        replies: {
            type: [Object]
        },
        text: {
            type: String,
            required: true
        },
        likedBy: {
            type: [String],
        },
        dislikedBy: {
            type: [String]
        }
    }
);

const CommentModel = mongoose.model('comment', commentSchema);

module.exports = CommentModel;