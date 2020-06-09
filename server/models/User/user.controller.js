const users = require('./user.service');

module.exports.create = async (data) => {
    return users.create(data)
};

module.exports.createAdmin = async (data) => {
    return users.createAdmin(data)
};

module.exports.getUserById = async (id) => {
    const response = await users.getUserById(id);
    return response[0];
};

module.exports.getAdminUsersCount = async () => {
    return await users.getAdminUsersCount();
};

