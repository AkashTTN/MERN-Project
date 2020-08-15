const chats = require('./chat.service')

module.exports.getChats = async (data) => {
    return await chats.getChats(data)
}

module.exports.create = async (data) => {
    return await chats.create(data)
}

module.exports.findChatById = async (data) => {
    return await chats.findChatById(data)
}

module.exports.findChatByParticipant = async (data) => {
    return await chats.findChatByParticipant(data)
}

module.exports.deleteChatById = async (data) => {
    return await chats.deleteChatById(data)
}

module.exports.getChatParticipantsData = async (data) => {
    return await chats.getChatParticipantsData(data)
}
