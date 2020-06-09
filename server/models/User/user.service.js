const UserModel = require('./user.model');

module.exports.create = async ({
    googleId,
    name,
    email
}) => {
    const user = await UserModel.create({
        googleId,
        name,
        email,
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