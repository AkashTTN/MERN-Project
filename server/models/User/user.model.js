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
        newProfileData: {}
    }
);

userSchema.virtual('followersData', {
    ref: 'user',
    localField: 'followers',
    foreignField: 'googleId'
});

userSchema.virtual('followingData', {
    ref: 'user',
    localField: 'following',
    foreignField: 'googleId'
});

userSchema.virtual('friendsData', {
    ref: 'user',
    localField: 'friends',
    foreignField: 'googleId'
});

userSchema.index({ name: 'text' })
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;