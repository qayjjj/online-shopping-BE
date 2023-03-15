const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const jwtKey = process.env.KEY || ''
const authen = require('../middleware/auth')
const { Router } = require('express')

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email, password })
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
        const token = jwt.sign({ email: user.email, id: user._id }, jwtKey)
        res.send({ message: 'Logged in.', token, userID: user._id })
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

router.get('/getAll', async (req, res) => {
  const allAccounts = await User.find({})
  res.status(200).json({ message: allAccounts })
})

router.post('/get', authen, async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) res.status(200).json({ message: user })
  else res.status(404).json({ message: 'User not found.' })
})

router.post('/getFriends', authen, async (req, res) => {
  const user = await User.findById(req.id)
  if (user) {
    const friendlist = []
    await Promise.all(
      user.friends.map(async (key) => {
        const friend = await User.findById(key).lean()
        friendlist.push(friend)
      }),
    )
    res.status(200).json({ message: friendlist })
  } else {
    res.status(404).json({ message: 'User not found.' })
  }
})

router.post('/add', authen, async (req, res) => {
  const user = await User.findById(req.id)
  const friend = await User.findOne({ email: req.body.email })
  if (user && friend) {
    if (user.friends) user.friends.push(friend._id)
    else user.friends = [friend._id]
    await User.updateOne({ _id: user._id }, { friends: user.friends })
    res.status(200).json({ message: 'OK' })
  } else {
    res.status(404).json({ message: 'User not found.' })
  }
})
module.exports = router
