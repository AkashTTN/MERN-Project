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
            type: [String]
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