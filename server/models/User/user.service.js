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

module.exports.getUserById = async (id) => {
    const user = await UserModel.find({ googleId: id });
    return user;
};