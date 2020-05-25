const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        googleId: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        likedPosts: {
            type: Array,
            default: []
        },
        dislikedPosts: {
            type: Array,
            default: []
        }
    }
);

const UserModel = mongoose.model('user', userSchema);

module.exports = {
    UserModel
};