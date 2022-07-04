const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtKey = process.env.KEY || ''

router.post('/cart/view', async (req, res) => {
  const order = req.body
  res.send({ message: order })
})

module.exports = router
