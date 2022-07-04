require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const PORT = 9000
//Route
const accountRoute = require('./routes/account')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const addressRoute = require('./routes/address')
const { application } = require('express')

app.use(express.json({ limit: '50mb' }))
app.use(cors())

mongoose.connect(
  'mongodb+srv://qayjjj:123@cluster0.l4n4n.mongodb.net/usersdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
;() => {
  console.log('Connected to DB')
}

app.listen(PORT, () => {
  console.log('Running on 9000')
})
app.use('/api/account', accountRoute)
app.use('/api/product', productRoute)
app.use('/api/cart', cartRoute)
app.use('/api/address', addressRoute)
