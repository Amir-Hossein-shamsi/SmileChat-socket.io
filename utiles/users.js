const users = []

const addUser = ({ id, username, room }) => {
  console.log(room)
  if (!username || !room) {
    return {
      error: 'Username or room is Empty',
    }
  }
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })
  if (existingUser) {
    return {
      error: 'Username was tacken pls choose a uniqe username',
    }
  }

  const user = { id, username, room }
  users.push(user)
  return { user }
}

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room)
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const removeUser = (id) => {
  const targetIndex = users.findIndex((user) => {
    return user.id === id
  })
  if (targetIndex !== -1) {
    return users.splice(targetIndex, 1)[0]
  }
}
module.exports = { addUser, getUsersInRoom, getUser, removeUser }
