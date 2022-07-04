const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = require('./user')
const ProductModel = require('./product')

const CartModel = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
  },
  list: {
    type: Object,
    required: true,
  },
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalValue: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('carts', CartModel)
