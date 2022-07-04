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
    // remove address from user's address list
    if (user.addressList.contains(addressID)) {
      newAddressList = user.addressList.filter(
        (address) => address !== addressID,
      )
      //   update in user collection
      await User.findByIdAndUpdate(
        { _id: user._id },
        { addressList: newAddressList },
      )

      // delete in address collection
      await Address.deleteOne({ _id: addressID })

      // Update other address(es) if the deleted one was the default
      if (address.defaultAddress) {
        if (newAddressList.length == 1) {
          await Address.updateOne(
            { userID: user._id },
            { defaultAddress: true },
          )
        } else {
          await Address.findOneAndUpdate(
            { userID: user._id },
            { defaultAddress: true },
          )
        }
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

    // update user's address list
    user.addressList.push(newAddress._id)
    await User.findByIdAndUpdate(
      { _id: user._id },
      { addressList: user.addressList },
    )

    // update address collection based on the default option
    if (newAddress.defaultAddress) {
      Address.updateMany({ userID: req.id }, { defaultAddress: false })
      Address.findByIdAndUpdate(newAddress._id, { defaultAddress: true })
    } else {
      if (user.addressList.length < 1) {
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
