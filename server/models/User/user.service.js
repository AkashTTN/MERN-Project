const {
    UserModel
} = require('./user.model');

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
    return {
        user
    };
};

module.exports.getUserById = async (id) => {
    const user = await UserModel.find({ googleId: id });
    return user;
};