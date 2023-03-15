const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const jwtKey = process.env.KEY || ''
const Inbox = require('../models/inbox')
const authen = require('../middleware/auth')

router.post('/get', authen, async (req, res) => {
  const inbox = await Inbox.findOne({
    $or: [
      { user1: req.body.user, user2: req.id },
      { user1: req.id, user2: req.body.user },
    ],
  })
  if (inbox) {
    res.status(200).json({ message: inbox.messages })
  } else {
    res.status(404).json({ message: 'Inbox not found' })
  }
})

router.post('/getLatestTexts', authen, async (req, res) => {
  const users = req.body.users
  const data = []
  await Promise.all(
    users.map(async (user) => {
      if (user !== req.id) {
        const inbox = await Inbox.findOne({
          $or: [
            { user1: user._id, user2: req.id },
            { user1: req.id, user2: user._id },
          ],
        }).lean()
        if (inbox) data.push(inbox.messages[inbox.messages.length - 1])
      }
    }),
  )

  res.status(200).json({ message: data })
})

module.exports = router
