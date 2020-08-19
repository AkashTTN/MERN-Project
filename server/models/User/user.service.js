const UserModel = require('./user.model');
const chats = require('../Chat/chat.controller')
const shortid = require('shortid')

module.exports.create = async ({
    googleId,
    name,
    email,
    profilePicture
}) => {

    const teams = ['HR', 'IT', 'MANAGEMENT']

    const randomTeam = teams[Math.floor(Math.random() * teams.length)];

    const user = await UserModel.create({
        googleId,
        name,
        email,
        profilePicture,
        team: randomTeam
    });

    const newUserObject = { ...user._doc }
    delete newUserObject['_id']

    return newUserObject

};

module.exports.createAdmin = async ({
    googleId,
    name,
    email
}) => {

    const user = await UserModel.create({
        googleId,
        name,
        email,
        team: 'ADMIN',
        role: 'admin'
    });

    const newUserObject = { ...user._doc }
    delete newUserObject['_id']

    return newUserObject

};

module.exports.getUserById = async (id) => {
    const user = await UserModel.find({ googleId: id }, { _id: 0, __v: 0 });
    return user;
};

module.exports.getUserSocialDataById = async (id) => {
    const { followersData, followingData, friendsData } = await UserModel.findOne({ googleId: id }, { _id: 0, __v: 0 }).populate('followersData').populate('friendsData').populate('followingData');
    const socialData = {
        friends: friendsData,
        following: followingData,
        followers: followersData
    }
    return socialData;
};

module.exports.getAdminUsersCount = async () => {
    return await UserModel.find({ role: 'admin' }).countDocuments();
};

module.exports.assignUserToComplaint = async ({
    complaintId,
    department
}) => {

    const users = await UserModel.aggregate([
        { $match: { team: department } },
        {
            $project: {
                _id: 0,
                googleId: 1,
                name: 1,
                totalComplaints: { $size: "$assignedComplaints" }
            }
        },
        { $sort: { totalComplaints: 1 } }
    ])

    if (users.length !== 0) {

        const userWithLeastAssignedComplaints = users[0]

        const { googleId } = userWithLeastAssignedComplaints

        return await UserModel.findOneAndUpdate(
            { googleId },
            { $addToSet: { assignedComplaints: complaintId } },
            { new: true }
        )

    }

    // If no employee with that department found, assign complaint to admin
    return await UserModel.findOneAndUpdate(
        { team: 'ADMIN' },
        { $addToSet: { assignedComplaints: complaintId } },
        { new: true }
    )

}

module.exports.removeComplaint = async ({ googleId, complaintId }) => {
    return await UserModel.findOneAndUpdate(
        { googleId },
        { $pull: { assignedComplaints: complaintId } },
        { new: true }
    )
}

module.exports.updateProfile = async ({ id, name, team }) => {
    const response = await UserModel.findOneAndUpdate({ googleId: id }, {
        $set: { updateStatus: true, newProfileData: { name, team } }
    }, { new: true })

    return response
}

module.exports.updateRequestStatus = async ({ userId, status }) => {

    const requestData = await UserModel.findOne({
        googleId: userId
    })

    if (requestData.updateStatus === false) {
        return null
    }

    return await UserModel.findOneAndUpdate(
        { googleId: userId },
        {
            $set: {
                name: status === 'approved' ? requestData.newProfileData.name : requestData.name,
                team: status === 'approved' ? requestData.newProfileData.team : requestData.team,
                role: (status === 'approved' && requestData.newProfileData.team === 'ADMIN') ? 'admin' : requestData.role,
                updateStatus: false,
                newProfileData: {}
            }
        },
        { new: true }
    )

}

module.exports.getUsersWithPendingRequests = async () => {
    return await UserModel.find({ updateStatus: true }, { _id: 0 })
}

module.exports.getUsersByName = async ({ name }) => {

    return await UserModel.find(
        { $text: { $search: name } },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } })

}

module.exports.getFollowers = async ({ id }) => {

    return await UserModel.findOne(
        { googleId: id },
        { _id: 0 }
    ).populate('followersData')

}

module.exports.getFollowing = async ({ id }) => {

    return await UserModel.findOne(
        { googleId: id },
        { _id: 0 }
    ).populate('followingData')

}

module.exports.getFriends = async ({ id }) => {

    return await UserModel.findOne(
        { googleId: id },
        { _id: 0 }
    ).populate('friendsData')

}

module.exports.updateFriendStatus = async ({ id, status, friendId }) => {

    if (status) {
        const response = await UserModel.findOneAndUpdate(
            { googleId: id },
            { $addToSet: { friends: friendId } },
            { new: true }
        )

        await UserModel.findOneAndUpdate(
            { googleId: friendId },
            { $addToSet: { friends: id } },
            { new: true }
        )

        return response

    } else {
        const response = await UserModel.findOneAndUpdate(
            { googleId: id },
            { $pull: { friends: friendId } },
            { new: true }
        )

        await UserModel.findOneAndUpdate(
            { googleId: friendId },
            { $pull: { friends: id } },
            { new: true }
        )

        return response
    }
}

module.exports.updateFollowStatus = async ({ id, status, followId }) => {

    const session = await UserModel.startSession()

    if (status) {
        const response = await UserModel.findOneAndUpdate(
            { googleId: id },
            { $addToSet: { following: followId } },
            { new: true, session }
        )

        await UserModel.findOneAndUpdate(
            { googleId: followId },
            { $addToSet: { followers: id } },
            { session }
        )

        return response
    } else {
        const response = await UserModel.findOneAndUpdate(
            { googleId: id },
            { $pull: { following: followId } },
            { new: true, session }
        )

        await UserModel.findOneAndUpdate(
            { googleId: followId },
            { $pull: { followers: id } },
            { session }
        )

        return response
    }
}

module.exports.getChats = async ({ id }) => {
    const { chats: userChats } = await UserModel
        .findOne({ googleId: id }, { _id: 0, chats: 1 })

    const chatsArray = await chats.getChats(userChats)

    return chatsArray

}

module.exports.deleteChat = async ({ id }) => {

    const chat = await chats.findChatById(id)

    const userOne = await UserModel.findOneAndUpdate({
        googleId: chat.participants[0].googleId
    }, { $pull: { chats: id } })

    const userTwo = await UserModel.findOneAndUpdate({
        googleId: chat.participants[1].googleId
    }, { $pull: { chats: id } })

    const deletedChat = await chats.deleteChatById(id)

    return deletedChat

}

module.exports.addChat = async ({ id, participantId }) => {

    const chat = await chats.findChatByParticipant({ id, participantId })
    console.log('chat exists?', chat)
    if (chat) return chat

    const newChat = await chats.create({
        chatId: shortid.generate(),
        participants: [id, participantId],
    })

    const userOne = await UserModel.findOneAndUpdate({ googleId: id }, {
        $addToSet: { chats: newChat.chatId }
    }, { new: true })

    const userTwo = await UserModel.findOneAndUpdate({ googleId: participantId }, {
        $addToSet: { chats: newChat.chatId }
    }, { new: true })

    if (userOne.chats.includes(newChat.chatId) && userTwo.chats.includes(newChat.chatId)) {
        return newChat
    }

}