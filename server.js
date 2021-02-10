const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const filter_bad_words = require('bad-words')
const {
  addUser,
  getUsersInRoom,
  getUser,
  removeUser,
} = require('./utiles/users.js')
const { genaratedMessage } = require('./utiles/messages.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
  console.log('websocket is connecting ...')

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      ...options,
    })
    if (error) {
      return callback(error)
    }
    console.log(user)
    socket.join(user.room)
    socket.emit('serverMessage', genaratedMessage('SmileBot', 'Welcome to'))

    socket.broadcast
      .to(user.room)
      .emit(
        'serverMessage',
        genaratedMessage('SmileBot', `${user.username} has joined`)
      )
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })

    callback()
  })

  socket.on('clientMessage', (message) => {
    const user = getUser(socket.id)
    const filter = new filter_bad_words({ placeHolder: '***' })
    message = filter.clean(message)
    io.to(user.room).emit(
      'serverMessage',
      genaratedMessage(user.username, message)
    )
  })

  socket.on('disconnected', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit(
        'serverMessage',
        genaratedMessage('SmileBot', `${user.username} has left`)
      )

      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      })
    }
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
