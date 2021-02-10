const genaratedMessage = (who, text) => {
  return {
    who,
    text,
    createdAt: new Date().getTime(),
  }
}

module.exports = { genaratedMessage }
