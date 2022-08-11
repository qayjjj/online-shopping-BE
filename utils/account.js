const User = require('../models/user')

const getUser = async (userID, chatID) => {
  let user = await User.findById(userID).lean()
  user['chatID'] = chatID
  return user
}

module.exports = getUser
