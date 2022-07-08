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
    const addresses = await Address.find({ userID: req.id })
    res.status(200).json({ message: addresses })
  } else {
    res.status(404).send({
      message: 'User not found',
    })
  }
})

router.post('/delete', authen, async (req, res) => {
  const { addressID } = req.body
  const address = await Address.findOne({ _id: addressID })

  if (address) {
    // delete in address collection
    await Address.deleteOne({ _id: addressID })

    // Update other address(es) if the deleted one was the default
    if (address.defaultAddress) {
      const addressList = await Address.find({ userID: req.id }).exec()
      if (addressList.length == 1) {
        await Address.updateOne({ userID: req.id }, { defaultAddress: true })
      } else {
        await Address.findOneAndUpdate(
          { userID: req.id },
          { defaultAddress: true },
        )
      }
    }
    res.status(200).send({ message: 'Deleted' })
  } else {
    res.status(404).send({
      message: 'Address not found.',
    })
  }
})

router.post('/edit', authen, async (req, res) => {
  const { addressID } = req.body
  const address = await Address.findOne({ _id: addressID })
  if (address) {
    if (address.defaultAddress !== req.body.item.defaultAddress) {
      await Address.updateMany(
        { userID: req.id },
        { defaultAddress: !req.body.item.defaultAddress },
      )
    }
    await Address.updateOne({ _id: addressID }, req.body.item)

    res.status(200).send({ message: 'Address updated successfully.' })
  } else {
    res.status(404).send({ message: 'Address not found.' })
  }
})

router.post('/add', authen, async (req, res) => {
  const user = await User.findOne({ userId: req.id })
  const address = req.body.item
  if (user) {
    // create new address with user id
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

    // update address collection based on the default option
    if (newAddress.defaultAddress) {
      await Address.updateMany({ userID: req.id }, { defaultAddress: false })
      await Address.findByIdAndUpdate(newAddress._id, { defaultAddress: true })
    } else {
      const userAddressList = await Address.find({ userID: req.id })
      if (userAddressList.length == 1) {
        Address.findByIdAndUpdate(newAddress._id, { defaultAddress: true })
      }
    }
  } else {
    res.status(404).send({
      message: 'User not found',
    })
  }
})

module.exports = router
