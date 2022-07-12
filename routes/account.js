const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const jwtKey = process.env.KEY || ''
const authen = require('../middleware/auth')

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email, password }).lean()
  if (user) {
    const token = jwt.sign({ email, id: user._id }, jwtKey)
    res.send({ message: 'Logged in.', token, userID: user._id })
  } else {
    res.status(403).send({ message: 'Wrong credentials.' })
  }
})

router.post('/signup', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    res.status(402).json({ message: 'This email is not available.' })
  } else {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: req.body.password,
    })
    user
      .save(user)
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the account.',
        })
      })
  }
})

router.post('/verify', authen, async (req, res) => {
  res.send({ message: 'Ok.' })
})

module.exports = router
