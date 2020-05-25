const users = require('./user.service');

module.exports.create = async (data) => {
    return users.create(data)
};

module.exports.getUserById = async (id) => {
    const response = await users.getUserById(id);
    return response[0];
};