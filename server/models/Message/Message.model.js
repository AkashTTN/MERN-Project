const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid')

const messageSchema = new Schema(
    {
        messageId: {
            type: String,
            default: shortid.generate()
        },
        message: {
            type: String,
            required: true
        },
        chatId: String,
        userId: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

const MessageModel = mongoose.model('message', messageSchema)

module.exports = MessageModel