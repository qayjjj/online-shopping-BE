const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const Order = require('../models/order')
const jwt = require('jsonwebtoken')
const jwtKey = process.env.KEY || ''
const authen = require('../middleware/auth')

router.post('/dashboard/delete', authen, async (req, res) => {
  await Product.deleteOne({ _id: req.body.productID })
  res.status(200).json({ message: 'Deleted' })
})

router.post('/dashboard/add', authen, async (req, res) => {
  const newProduct = req.body.item
  newProduct.userID = req.id
  const product = new Product(newProduct)
  product
    .save(product)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while adding the product.',
      })
    })
})

router.post('/dashboard/edit', authen, async (req, res) => {
  const { productID } = req.body
  const product = await Product.findOne({ _id: productID })
  if (product) {
    await Product.updateOne({ _id: productID }, req.body.item)
    res.status(200).send({ message: 'Product updated successfully.' })
  } else {
    res.status(404).send({ message: 'Product not found.' })
  }
})

router.post('/dashboard/list', authen, async (req, res) => {
  const userID = req.id
  const products = await Product.find({ userID })
    .populate('userID', 'lastName')
    .lean()
  res.status(200).json({ message: products })
})

router.get('/details', async (req, res) => {
  const id = req.query.productID
  const product = await Product.findById(id)
  res.status(200).json({ message: product })
})

router.get('/getAll', async (req, res) => {
  const allProducts = await Product.find({})
  res.status(200).json({ message: allProducts })
})

router.get('/getTop', async (req, res) => {
  const topProducts = await Product.find()
    .sort({ sold: -1 })
    .collation({ locale: 'en_US', numericOrdering: true })
    .limit(4)
  res.status(200).json({ message: topProducts })
})

module.exports = router
