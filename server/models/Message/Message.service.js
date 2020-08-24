const MessageModel = require('./Message.model')

module.exports.create = async ({ chatId, userId, message }) => {
    return await MessageModel.create({ chatId, userId, message })
}

module.exports.getMessageById = async (id) => {
    return await MessageModel.findOne({ messageId: id }, { _id: 0, __v: 0 })
}

module.exports.deleteMessagesByChatId = async (id) => {
    return await MessageModel.deleteMany({ chatId: id })
}