const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        chatId: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

chatSchema.virtual('participants', {
    ref: 'user',
    localField: 'chatId',
    foreignField: 'chats'
});


chatSchema.virtual('messages', {
    ref: 'message',
    localField: 'chatId',
    foreignField: 'chatId'
});

chatSchema.set('toObject', { virtuals: true });
chatSchema.set('toJSON', { virtuals: true });

const ChatModel = mongoose.model('chat', chatSchema);

module.exports = ChatModel;