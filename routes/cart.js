const express = require('express')
const router = express.Router()
const Cart = require('../models/cart')
const Product = require('../models/product')
const jwt = require('jsonwebtoken')
const jwtKey = process.env.KEY || ''
const authen = require('../middleware/auth')

router.post('/view', authen, async (req, res) => {
  const userCart = await Cart.findOne({ userID: req.id })
  if (userCart) {
    const items = []
    await Promise.all(
      Object.keys(userCart.list).map(async (key) => {
        const product = await Product.findById(key).lean()
        const item = {
          ...product,
          quantity: userCart.list[key],
        }
        items.push(item)
      }),
    )
    res.status(200).json({ message: items })
  } else {
    res.status(404).send({
      message: 'User not found',
    })
  }
})

router.post('/add', authen, async (req, res) => {
  const userCart = await Cart.findOne({ userID: req.id })
  const { productID, quantity } = req.body
  const product = await Product.findOne({ _id: productID })

  if (userCart) {
    userCart.totalQuantity += quantity
    if (userCart.list[productID]) userCart.list[productID] += quantity
    else userCart.list[productID] = quantity
    userCart.totalValue += product.price * quantity
    try {
      await Cart.updateOne(
        { userID: req.id },

        {
          list: userCart.list,
          totalQuantity: userCart.totalQuantity,
          totalValue: userCart.totalValue,
        },
      )

      res.status(200).send({ message: 'Success' })
    } catch (e) {
      res.status(400).send({ message: e })
    }
  } else {
    const cart = new Cart({
      userID: req.id,
      list: { [productID]: quantity },
      totalQuantity: quantity,
      totalValue: product.price * quantity,
    })
    cart
      .save()
      .then((data) => {
        res.status(200).send({
          message: 'Success',
        })
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while adding the product.',
        })
      })
  }
})

router.post('/remove', authen, async (req, res) => {
  const userCart = await Cart.findOne({ userID: req.id })
  const { productID, option } = req.body
  const product = await Product.findOne({ _id: productID })
  if (userCart) {
    if (userCart.list[productID]) {
      if (option == 'all') {
        userCart.totalQuantity -= userCart.list[productID]
        userCart.totalValue -= product.price * userCart.list[productID]
        delete userCart.list[productID]
      } else {
        if (userCart.totalQuantity == 1) {
          userCart.totalQuantity -= 1

          delete userCart.list[productID]
        } else {
          userCart.totalQuantity -= 1
          userCart.list[productID] -= 1
        }
        userCart.totalValue -= product.price
      }
      await Cart.updateOne(
        { userID: req.id },
        {
          list: userCart.list,
          totalQuantity: userCart.totalQuantity,
          totalValue: userCart.totalValue,
        },
      )
      res.status(200).send({ message: userCart })
    } else
      res.status(404).send({
        message: 'Product not found.',
      })
  } else {
    res.status(404).send({
      message: 'User not found.',
    })
  }
})

router.post('/getQuantity', authen, async (req, res) => {
  const userCart = await Cart.findOne({ userID: req.id })
  if (userCart) {
    res.status(200).send({
      message: userCart.totalQuantity,
    })
  } else {
    res.status(404).send({
      message: 'User not found.',
    })
  }
})

router.post('/getValue', authen, async (req, res) => {
  const userCart = await Cart.findOne({ userID: req.id })
  if (userCart) {
    res.status(200).send({
      message: userCart.totalValue,
    })
  } else {
    res.status(404).send({
      message: 'User not found.',
    })
  }
})

module.exports = router
