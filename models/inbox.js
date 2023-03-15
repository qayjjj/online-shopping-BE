const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = require('./user')

const InboxModel = new Schema({
  messages: {
    type: Array,
    required: true,
  },
  lastMsg: {
    type: String,
    required: true,
  },
  user1: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
  },
})

module.exports = mongoose.model('inboxes', InboxModel)
