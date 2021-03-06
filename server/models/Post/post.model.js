const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        user: {
            email: {
                type: String,
                required: true,
            },
            googleId: {
                type: String,
                required: true
            }
        },
        text: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        category: {
            type: String,
            required: true
        },
        likeCount: Number,
        dislikeCount: Number,
    }
);

const PostModel = mongoose.model('post', postSchema);

module.exports = {
    PostModel
};