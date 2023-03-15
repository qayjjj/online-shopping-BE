require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const app = express()
const http = require('http')
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: '*',
  },
})

//Router
const accountRouter = require('./routes/account')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const addressRouter = require('./routes/address')
const orderRouter = require('./routes/order')
const inboxRouter = require('./routes/inbox')
const sendMessage = require('./utils/inbox')
const getUser = require('./utils/account')
const { application } = require('express')

const PORT = 9000
app.use(express.json({ limit: '50mb' }))
app.use(cors())

// Run when client connects
io.on('connection', async (socket) => {
  const users = []
  const listPromise = []
  io.of('/').sockets.forEach(async (socket, id) => {
    listPromise.push(getUser(socket.userID, id))
  })

  await Promise.all(
    listPromise.map(async (item) => {
      const user = await item
      users.push(user)
    }),
  )

  io.emit('users', users)

  // private message
  socket.on('sendMsg', ({ content, toUser, toChat }) => {
    console.log('eeee')
    sendMessage(content, socket.userID, toUser)
    io.to(toChat).emit('receiveMsg', {
      content,
      from: socket.userID,
    })
  })
})

// Check username, allow connection
io.use((socket, next) => {
  const userID = socket.handshake.auth.userID
  if (!userID) {
    return next(new Error('invalid user ID'))
  }
  socket.userID = userID
  next()
})

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

server.listen(PORT, () => {
  console.log('Running on 9000')
})
app.use('/api/account', accountRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/inbox', inboxRouter)
