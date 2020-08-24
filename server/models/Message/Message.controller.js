const messages = require('./Message.service')

module.exports.create = async (data) => {
    return await messages.create(data)
}

module.exports.getMessage = async (id) => {
    return await messages.getMessageById(id)
}

module.exports.deleteMessagesByChatId = async (id) => {
    return await messages.deleteMessagesByChatId(id)
}