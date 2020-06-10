const UserModel = require('./user.model');

module.exports.create = async ({
    googleId,
    name,
    email
}) => {

    const teams = ['ADMIN', 'HR', 'IT', 'MANAGEMENT']

    const randomTeam = teams[Math.floor(Math.random() * teams.length)];

    const user = await UserModel.create({
        googleId,
        name,
        email,
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