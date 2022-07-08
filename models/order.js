const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = require('./user')
const ProductModel = require('./product')

const OrderModel = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
    },
    billingAddress: {
      type: Object,
      require: true,
    },
    list: {
      type: Object,
      required: true,
    },
    totalValue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('orders', OrderModel)
