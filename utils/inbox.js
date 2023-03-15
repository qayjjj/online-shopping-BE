const Inbox = require('../models/inbox')

const sendMessage = async (content, from, to) => {
  const inbox = await Inbox.findOne({ $or: [{ user1: from }, { user1: to }] })
  console.log(inbox)
  const message = {
    content,
    from,
    to,
    timeStamp: new Date(),
  }

  if (inbox) {
    try {
      const tempMsg = [...inbox.messages]
      tempMsg.push(message)
      await Inbox.updateOne({ _id: inbox._id }, { messages: tempMsg })
      return true
    } catch (e) {
      return false
    }
  } else {
    const newInbox = new Inbox({
      messages: [message],
      user1: from,
      user2: to,
    })

    newInbox
      .save()
      .then(() => {
        console.log('first')
        return true
      })
      .catch((err) => {
        return false
      })
  }
}

module.exports = sendMessage
