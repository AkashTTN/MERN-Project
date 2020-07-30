const ChatModel = require('./chat.model')
const users = require('../User/user.controller')
const messages = require('../Message/Message.controller')

module.exports.getChats = async (chatIdArray) => {

    const chatsArray = chatIdArray.map(async chatId => {
        return await ChatModel.findOne({ chatId }, { _id: 0, __v: 0, id: 0 }).populate('participants').populate('messages')
    })

    return Promise.all(chatsArray).then(chats => chats)

}

module.exports.create = async ({ chatId, participants }) => {
    return await ChatModel.create({ chatId, participants })
}

module.exports.findChatById = async (id) => {
    return await ChatModel.findOne({ chatId: id }, { _id: 0 }).populate('participants')
}

module.exports.deleteChatById = async (id) => {
    await messages.deleteMessagesByChatId(id)
    return await ChatModel.findOneAndDelete({ chatId: id })
}

module.exports.findChatByParticipant = async ({ id, participantId }) => {

    const chatsOfUserOne = await users.getChats({ id })
    const chatIdsOfUserOne = chatsOfUserOne.map(chat => chat.chatId)

    const chatsOfUserTwo = await users.getChats({ id: participantId })
    const chatIdsOfUserTwo = chatsOfUserTwo.map(chat => chat.chatId)

    return chatIdsOfUserOne.some(r => chatIdsOfUserTwo.includes(r))

    // .findOne(
    //     { participants: { $all: participants, $size: 2 } },
    // )
}