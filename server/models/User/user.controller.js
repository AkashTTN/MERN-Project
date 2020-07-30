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

module.exports.updateProfile = async (data) => {
    return await users.updateProfile(data)
}

module.exports.getUsersWithPendingRequests = async (data) => {
    return await users.getUsersWithPendingRequests(data)
}

module.exports.updateRequestStatus = async (data) => {
    return await users.updateRequestStatus(data)
}

module.exports.getUsersByName = async (data) => {
    return await users.getUsersByName(data)
}

module.exports.updateFriendStatus = async (data) => {
    return await users.updateFriendStatus(data)
}

module.exports.updateFollowStatus = async (data) => {
    return await users.updateFollowStatus(data)
}

module.exports.getChats = async (data) => {
    return await users.getChats(data)
}

module.exports.deleteChat = async (data) => {
    return await users.deleteChat(data)
}

module.exports.addChat = async (data) => {
    return await users.addChat(data)
}
