const UserModel = require('./user.model');
const { request } = require('express');

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
                name: requestData.newProfileData.name,
                team: requestData.newProfileData.team,
                role: requestData.newProfileData.team === 'ADMIN' ? 'admin' : requestData.role,
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