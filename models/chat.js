const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    message: { type: String},
    type: { type: String, required: true }, // 'text' or 'image'
    timestamp: { type: Date, default: Date.now },
    groupName: { type: String, required: true },
  });

const ChatMessage = mongoose.model('ChatMessage', chatSchema);

module.exports = ChatMessage;
