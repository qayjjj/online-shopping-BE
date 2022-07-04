const jwt = require('jsonwebtoken')
const jwtKey = process.env.KEY || ''

const authen = (req, res, next) => {
  const { token } = req.body
  try {
    if (token) {
      const result = jwt.decode(token, jwtKey)
      req.id = result.id
      next()
    } else res.status(401).json({ message: 'token not found' })
  } catch (error) {
    res.status(401).json({ message: 'token expired' })
  }
}

module.exports = authen
