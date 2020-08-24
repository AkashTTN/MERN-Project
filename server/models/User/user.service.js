const UserModel = require('./user.model');

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
    const user = await UserModel.find({ googleId: id });
    return user;
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
                role: (status === 'approved' && requestData.newProfileData.team === 'ADMIN') ? 'admin' : 'employee',
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

    if (status) {
        const response = await UserModel.findOneAndUpdate(
            { googleId: id },
            { $addToSet: { following: followId } },
            { new: true }
        )

        await UserModel.findOneAndUpdate(
            { googleId: followId },
            { $addToSet: { followers: id } }
        )

        return response
    } else {
        const response = await UserModel.findOneAndUpdate(
            { googleId: id },
            { $pull: { following: followId } },
            { new: true }
        )

        await UserModel.findOneAndUpdate(
            { googleId: followId },
            { $pull: { followers: id } }
        )

        return response
    }
}