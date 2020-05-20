const users = require('./user.service');

module.exports.create = async ({ name, googleID, email }) => {
    return users.create({
        name,
        googleID,
        email,
    })
};

module.exports.getUserById = async (id) => {
    const response = await users.getUserById(id);
    return response[0];
};