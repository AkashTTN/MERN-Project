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
        role: {
            type: String,
            default: 'employee'
        },
        profilePicture: String,
        team: String,
        assignedComplaints: {
            type: Array,
            default: []
        },
        updateStatus: {
            type: Boolean,
            default: false
        },
        followers: [String],
        following: [String],
        friends: [String],
        chats: [{ type: String, ref: 'chat' }],
        newProfileData: {}
    }
);

userSchema.index({ name: 'text' })

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;