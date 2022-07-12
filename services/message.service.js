const BaseService = require('./base.service')
const Message = require('../models/message.model.js')

module.exports = class MessageService extends BaseService {
  constructor(){
    super()
  }

  async sendMessage(customerId, senderId, content) {
    const newMessage = await Message.create({
        customer: customerId,
        sender: senderId,
        content: content,
    })

    return newMessage
  }

  async readMessages(customerId, readerId) {
    const messages = await Message.find({customer: customerId})
    await Promise.all(messages.map(async m => {
      if(m.sender !== readerId){
          m.wasRead = true
          await m.save()
      }
    }))
  }

  async getMessagesByCustomerId(userId){
      const messages = await Message.find({customer: userId})
      return messages
  }
}