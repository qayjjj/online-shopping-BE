const express = require('express')
const router = express.Router()
const Address = require('../models/address')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const jwtKey = process.env.KEY || ''
const authen = require('../middleware/auth')

router.post('/view', authen, async (req, res) => {
  const user = await User.findOne({ userID: req.id })
  if (user) {
    const addresses = []
    await Promise.all(
      Object.keys(userAddresses.list).map(async (key) => {
        const address = await Address.findById(key).lean()
        addresses.push(address)
      }),
    )
    res.status(200).json({ message: addresses })
  } else {
    res.status(404).send({
      message: 'User not found',
    })
  }
})

router.post('/delete', authen, async (req, res) => {
  const user = await User.findOne({ userID: req.id })
  const { addressID } = req.body
  const address = await Address.findOne({ _id: addressID })
  if (user) {
    if (user.addressList[addressID]) {
      delete user.addressList[addressID]
      if (address) {
        await Address.deleteOne({ _id: addressID })
      } else {
        res.status(404).send({
          message: 'Address not found.',
        })
      }
      res.status(200).send({ message: 'Deleted' })
    } else
      res.status(404).send({
        message: 'Address not found.',
      })
  } else {
    res.status(404).send({
      message: 'User not found.',
    })
  }
})

router.post('/edit', authen, async (req, res) => {
  const user = await User.findOne({ userId: req.id })
  const addressID = req.body.address._id
  if (user) {
    const addressData = await Address.findOne({ _id: addressID })
    if (addressData) {
      await Address.updateOne({ _id: addressID }, addressData)
      res.status(200).send({ message: 'Address updated successfully.' })
    } else {
      res.status(404).send({ message: 'Address not found.' })
    }
  } else {
    res.status(404).send({ message: 'User not found' })
  }
})

router.post('/add', authen, async (req, res) => {
  const user = await User.findOne({ userId: req.id })
  const { address } = req.body
  if (user) {
    const userAddress = {
      userID: req.id,
      ...address,
    }
    const newAddress = new Address(userAddress)
    newAddress
      .save(newAddress)
      .then(() =>
        res.status(200).send({
          message: 'Address added successfully.',
        }),
      )
      .catch((err) =>
        res.status(500).send({
          message:
            err.message || 'Some error occurred while adding the address.',
        }),
      )
    user.addressList[newAddress._id] = newAddress.defaultAddress
  } else {
    res.status(404).send({
      message: 'User not found',
    })
  }
})

router.post('/getDefault', authen, async (req, res) => {
  const user = await User.findOne({ userId: req.id })
  if (user) {
    if (user.addressList) {
      const list = Object.keys(user.addressList)
      let i = 0
      while (i < list.length) {
        if (user.addressList[list[i]]) {
          res.status(200).send({
            message: list[i],
          })
          break
        } else {
          i++
        }
      }
    } else {
      res.status(404).send({
        message: 'User address not found.',
      })
    }
  } else {
    res.status(404).send({
      message: 'User not found.',
    })
  }
})

module.exports = router
