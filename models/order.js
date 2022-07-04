const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = require('./user')
const ProductModel = require('./product')

const OrderModel = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
  },
  shippingAdress: {
    type: String,
    required: true,
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: ProductModel,
    required: true,
  },
  quantity: {
    type: Object,
    required: true,
  },
})

module.exports = mongoose.model('orders', OrderModel)
