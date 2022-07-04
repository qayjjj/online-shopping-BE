const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = require('./user')

const ProductModel = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('products', ProductModel)
