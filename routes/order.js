const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtKey = process.env.KEY || ''
const Cart = require('../models/cart')
const Order = require('../models/order')
const Address = require('../models/address')
const authen = require('../middleware/auth')

router.post('/complete', authen, async (req, res) => {
  const userCart = await Cart.findOne({ userID: req.id })
  const address = await Address.findOne({ _id: req.body.addressID })

  if (userCart) {
    const order = new Order({
      userID: req.id,
      billingAddress: address,
      list: userCart.list,
      totalValue: userCart.totalValue,
    })
    order
      .save()
      .then(() => Cart.findOneAndDelete({ userID: req.id }))
      .then(() => {
        res.status(200).send({
          message: order,
        })
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while completing the order.',
        })
      })
  } else {
    res.status(404).send({
      message: 'User not found.',
    })
  }
})

router.get('/getDetails', async (req, res) => {
  const id = req.query.orderID
  const order = await Order.findById(id)
  res.status(200).json({ message: order })
})

router.get('/getAll', async (req, res) => {
  const data = await Order.find({})
  res.status(200).json({ message: data })
})

module.exports = router
