const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = require('./user')

const AddressModel = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  addressType: {
    type: String,
    required: true,
  },
  defaultAddress: {
    type: Boolean,
    required: true,
  },
})

module.exports = mongoose.model('addresses', AddressModel)
