const express = require('express')
const router = express.Router()
const Product = require('../models/product')
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
module.exports = router
