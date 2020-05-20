const {
    UserModel
} = require('./user.model');

module.exports.create = async ({
    googleID,
    name,
    email
}) => {
    const user = await UserModel.create({
        googleID,
        name,
        email,
    });
    return {
        user
    };
};

module.exports.getUserById = async (id) => {
    const user = await UserModel.find({ googleID: id });
    return user;
};