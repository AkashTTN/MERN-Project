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

module.exports.assignUserToComplaint = async (data) => {
    return await users.assignUserToComplaint(data)
}

module.exports.removeComplaint = async (data) => {
    return await users.removeComplaint(data)
}
